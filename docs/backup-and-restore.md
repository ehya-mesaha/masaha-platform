# Backup and restore runbook

Written to be followed under pressure. Read it once now, before you ever need it.

## What is backed up

| Asset | Job | Schedule | Destination |
|---|---|---|---|
| Postgres database | `.github/workflows/backup-db.yml` | daily 02:00 Riyadh | `s3://$R2_BUCKET/db/` |
| `spaces` + `documents` buckets | `.github/workflows/backup-storage.yml` | weekly Mon 02:30 Riyadh | `s3://$R2_BUCKET/storage/` |
| Secrets (`.env.local`) | manual | on every change | password manager |
| Application code | git | every push | GitHub |

Both jobs encrypt with [age](https://github.com/FiloSottile/age) before upload. Dumps contain
bcrypt password hashes, and the `documents` bucket contains national ID scans — an
unencrypted copy sitting in object storage is a reportable data breach under PDPL.

Storage backups are **incremental**: `scripts/backup-storage.mjs` keeps a manifest in R2 and
only downloads objects it has not already stored. A full restore therefore needs *every*
`masaha-storage-*.tar.gz.age` archive, extracted oldest-first.

## One-time setup

1. **Generate the encryption key** on a machine you control:

   ```
   age-keygen -o masaha-backup-key.txt
   ```

   Store the **private** key in the password manager and on paper somewhere physical.
   Never put it in GitHub, in R2, or in this repo. A backup you cannot decrypt is not a backup.

2. **Create an R2 (or B2) bucket** — deliberately at a different provider from Supabase, so
   losing the Supabase account does not take the backups with it. Create an API token scoped
   to that bucket only.

3. **Create two healthchecks.io checks** ("db backup", "storage backup") with a grace period
   longer than the schedule, so a silently dead job raises an alarm.

4. **Add these GitHub repository secrets** (Settings → Secrets and variables → Actions):

   | Secret | Value |
   |---|---|
   | `DIRECT_URL` | Supabase **direct** connection string, port 5432 — *not* the pooled 6543 one |
   | `SUPABASE_URL` | same as `NEXT_PUBLIC_SUPABASE_URL` |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
   | `AGE_PUBLIC_KEY` | public key from step 1 (`age1...`) |
   | `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | R2 API token |
   | `R2_ENDPOINT` | `https://<account-id>.r2.cloudflarestorage.com` |
   | `R2_BUCKET` | bucket name |
   | `HEALTHCHECK_URL_DB`, `HEALTHCHECK_URL_STORAGE` | ping URLs from step 3 |
   | `SITE_URL` | production origin, no trailing slash |
   | `STREAMPAY_RECONCILE_SECRET` | same value as the deployed env var |

5. Run both workflows once manually (**Actions → Run workflow**) and confirm the objects land in R2.

6. **Do a restore drill** (below) before booking season opens.

## Retention

R2 lifecycle rules, configured in the Cloudflare dashboard:

- `db/` — keep 30 days of dailies.
- `storage/` — keep everything; increments are small and the archives are not independent.

Once a month, copy that month's first dump to a `monthly/` prefix by hand and keep 6.
The likeliest disaster is not the provider losing data — it is an admin action or a bad
migration deleting something that nobody notices for two weeks. Seven days of retention
does not save you there.

## Restore: database

1. **Stop writes first.** Put the site in maintenance or disable the deployment. Restoring
   under live traffic produces a second, worse inconsistency.
2. Pick the dump: `aws s3 ls s3://$R2_BUCKET/db/ --endpoint-url $R2_ENDPOINT`
3. Download, decrypt, inspect *before* loading:

   ```
   aws s3 cp s3://$R2_BUCKET/db/<file> . --endpoint-url $R2_ENDPOINT
   age -d -i masaha-backup-key.txt <file> | gunzip > restore.sql
   head -50 restore.sql
   ```

4. Restore into a **fresh** Supabase project first, never over live data:

   ```
   psql "<new-project-direct-url>" -v ON_ERROR_STOP=1 -f restore.sql
   ```

5. Point `DATABASE_URL` / `DIRECT_URL` at the restored project, redeploy, verify login and
   that recent bookings are present.
6. **Do not reopen bookings yet** — run the payment reconciliation below first.

## Restore: storage

```
aws s3 sync s3://$R2_BUCKET/storage/ ./restore-storage --endpoint-url $R2_ENDPOINT
for f in $(ls ./restore-storage/masaha-storage-*.tar.gz.age | sort); do
  age -d -i masaha-backup-key.txt "$f" | tar -xzf - -C ./extracted
done
```

Then re-upload `extracted/spaces` and `extracted/documents` to the corresponding buckets.
Recreate the buckets with their original visibility: **`spaces` public, `documents` private**.
Getting `documents` wrong exposes every seller's ID scan.

Note the ordering hazard: storage is backed up weekly and the database daily, so a restore
can leave `SpaceImage` rows pointing at objects the storage archive predates. Broken images
are recoverable (ask sellers to re-upload); wrong bucket visibility is not.

## Payment reconciliation after any restore — mandatory

Restoring the database to last night rolls back every booking made since, **but StreamPay
still took that money**. Those customers have a receipt and no booking.

1. Note the gap window: dump timestamp → moment writes stopped.
2. Pull StreamPay transactions for that window from their dashboard or API.
3. For each collected payment, look for a matching `PaymentOrder` in the restored database.
4. Missing locally → either recreate the booking manually, or refund. Record which, per order.
5. Cross-check the `StreamWebhookEvent` table: it is an append-only log of everything StreamPay
   sent us, and it is the best evidence of what happened during the gap.
6. Only when every collected payment is accounted for, reopen bookings.

The hourly `reconcile-payments` workflow surfaces the same class of problem in normal
operation: `expireStalePaymentOrders` sets `heldForReview` and writes `lastError` on any order
that expired locally while StreamPay reports collected funds. Those need a human. Check them
with:

```
select id, "bookingId", status, "lastError" from "PaymentOrder" where "lastError" is not null;
```

## Restore drill

Quarterly, and once before launch:

1. Restore last night's dump into a throwaway Supabase project.
2. Point a local checkout at it and confirm login works and bookings are visible.
3. **Time it.** That number is the real RTO — it is what you tell the manager, not an estimate.
4. Note anything that surprised you and fix this document.

## Current limits (Supabase free tier)

These backups run fine on the free tier, but note:

- Free tier egress is **5 GB/month total**, shared with real site traffic. `pg_dump` counts
  against it — watch the usage meter weekly and lengthen the schedule if it gets close.
- There is **no** Supabase-side automatic backup on free: these jobs are the *only* copy.
  That makes the healthcheck alerts and the restore drill mandatory, not optional.
- On Supabase Pro these jobs stay exactly as they are and become the second, independent
  layer alongside Supabase's own daily backups.
