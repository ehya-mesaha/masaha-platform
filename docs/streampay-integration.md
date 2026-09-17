# StreamPay integration and test runbook

## What MCP means here

StreamPay's MCP server is an interface for AI coding clients such as Codex, Cursor, VS Code, and Claude. It can expose the current OpenAPI documentation and merchant tools to those assistants. It is useful while developing and operating the integration, but it is not the payment connection used by customers.

The production flow remains:

1. Masaha's server creates a StreamPay customer, one-time product, and single-use payment link.
2. The browser is redirected to StreamPay's hosted checkout.
3. StreamPay redirects the customer back to Masaha.
4. Masaha verifies the payment link, invoice, exact amount, currency, customer, and optional payment directly with StreamPay.
5. A correctly signed StreamPay webhook provides the reliable server-to-server confirmation.
6. Only then does Masaha change the booking from `PENDING_PAYMENT` to `CONFIRMED`.

The website must never call StreamPay with a secret from browser code. The MCP URL and MCP bearer key are not required by the live website.

## StreamPay behaviour the code depends on

Observed against the live organization; keep these in mind before changing the payment code.

- **A `COMPLETED` payment link does not mean paid.** StreamPay also reports links that expired unpaid as `COMPLETED`, with `amount_collected_in_smallest_unit = 0` and no invoice. Payment is proven only by a `COMPLETED`, fully paid invoice whose `payment_link_id` is the order's own link. `GET /invoices?payment_link_id=…&statuses=COMPLETED` finds it, so confirmation needs neither the webhook nor the IDs in the return URL.
- **Links stay open longer than `valid_until` asks.** A link created with a 15-minute window came back with `valid_until` three hours later. Expiring an order therefore deactivates its link, and a payment that still lands after expiry is confirmed if the slot is free, or moved to `REFUND_PENDING` if it is not.
- **Amounts are strings with three decimals** (`"25.000"`), or a bare `"0"`.
- **Consumer creation can fail with `PHONE_ALREADY_REGISTERED`** as well as `DUPLICATE_CONSUMER`. A payment link does not need a consumer, so checkout falls back to issuing the link without one.
- **Prices below 1 SAR are rejected**, so a coupon may not bring the charge under that.

## Hosting

The database is in Supabase `ap-northeast-1` (Tokyo), so `vercel.json` pins functions to `hnd1`. Every booking and confirmation is a series of database round trips inside a transaction; from `iad1` each one crossed the Pacific and long bookings ran out of transaction time. If the database moves, move the region with it.

## Required server settings

Copy the StreamPay placeholders from `.env.example` into the deployment's encrypted environment settings and replace them there. Never commit or send the real values in chat.

- `STREAMPAY_X_API_KEY`: the complete Base64 `x-api-key` value.
- `STREAMPAY_WEBHOOK_SECRET`: the secret created with the webhook in StreamPay.
- `STREAMPAY_BRANCH_ID`: required when the key should operate on a non-default branch.
- `STREAMPAY_EXPECTED_SANDBOX`: keep `true` throughout testing. The application checks `/me` and refuses to run if the key belongs to the wrong environment.
- `STREAMPAY_RECONCILE_SECRET`: a separate long random value protecting the scheduled expiry route.
- `NEXT_PUBLIC_SITE_URL`: the exact public HTTPS origin used for checkout return URLs.

Apply the included database migration to the intended test database before opening the new checkout:

```powershell
npx prisma migrate deploy
```

Do not run the migration against production until a database backup and deployment window are confirmed.

## StreamPay dashboard setup

1. Rotate the exposed API key pair and create a sandbox key.
2. Confirm Mada, Visa, Mastercard, and Apple Pay are enabled for the sandbox organization.
3. Disable installments for booking payment links.
4. Keep bank transfer disabled until its pending-payment behavior and booking-hold policy are approved.
5. Create a webhook pointing to:

   `https://YOUR-DOMAIN/api/payments/stream/webhook`

6. Subscribe at minimum to:

   - `PAYMENT_SUCCEEDED`
   - `INVOICE_COMPLETED`
   - `PAYMENT_LINK_PAY_ATTEMPT_FAILED`
   - `PAYMENT_FAILED`
   - `PAYMENT_CANCELED`
   - `PAYMENT_REFUNDED`

7. Store the webhook secret as `STREAMPAY_WEBHOOK_SECRET`.
8. Schedule `GET /api/payments/stream/reconcile` every five minutes with the header `Authorization: Bearer <STREAMPAY_RECONCILE_SECRET>`.

## Proper sandbox testing

Use only StreamPay's sandbox organization and test cards. For card fields, use any two-word name, a future expiry date, and any three-digit CVC.

Representative official sandbox cards:

| Scenario | Card |
| --- | --- |
| Mada succeeds | `4201320111111010` |
| Mada insufficient funds | `4201320000311101` |
| Visa succeeds | `4111111111111111` |
| Visa 3DS frictionless succeeds | `4111114005765430` |
| Visa is declined | `4123120001090109` |
| Mastercard succeeds | `5421080101000000` |
| Mastercard is declined | `5204730000002514` |

Run every test below and record the local payment-order ID, StreamPay link ID, invoice ID, payment ID, final local order status, and booking status.

### Happy path

1. Create a single-date booking.
2. Confirm that the local booking is `PENDING_PAYMENT` before payment.
3. Pay with a successful sandbox card.
4. Confirm the return page displays success.
5. Confirm the payment order is `PAID`, the booking is `CONFIRMED`, and the exact amount in halalas matches StreamPay.
6. Confirm the owner receives one notification only after confirmation.

### Decline and retry

1. Pay with a declined or insufficient-funds card.
2. Confirm no booking is marked `CONFIRMED` and the owner receives no notification.
3. Retry the same active checkout with a success card.
4. Confirm it becomes paid exactly once.

### Security and duplicate delivery

1. Change `invoice_id`, `payment_id`, or `payment_link_id` in the return URL. The booking must remain unconfirmed.
2. Send a webhook with a missing or invalid signature. The endpoint must return `401`.
3. Replay the same valid webhook. It must not create a second confirmation or notification.
4. Replay a signature older than the allowed tolerance. It must be rejected.
5. Verify the API key, webhook secret, and full provider payload never appear in browser assets or application logs.

### Holds, expiry, and concurrency

1. Start checkout and leave it unpaid. The slot must be held for 15 minutes.
2. Try the same slot from a second buyer during the hold. It must be rejected as unavailable.
3. Run the reconciliation route after expiry. The order must become `EXPIRED`, the booking `PAYMENT_EXPIRED`, and the slot available again.
4. Test a late payment after another buyer has taken the released slot. The system must not double-book; it must create a full `REFUND_PENDING` record.
5. Double-click the pay button or repeat the same browser request. It must reuse or reject the same checkout key rather than create two payable bookings.

### Multi-date booking

1. Create a booking with several dates and different optional services.
2. Confirm StreamPay receives one link for the exact combined total.
3. Confirm all dates change to `CONFIRMED` together, never a partial subset.

### Failure recovery

1. Temporarily use an invalid API key. The payment request must fail without confirming or exposing the booking to the owner.
2. Use a sandbox key while `STREAMPAY_EXPECTED_SANDBOX=false`, then reverse it. Both mismatches must be blocked.
3. Temporarily make the webhook endpoint fail, then restore it. A StreamPay retry must process safely once.
4. Confirm expired links with no collected money are deactivated by reconciliation.

## Apple Pay sandbox note

StreamPay's sandbox Apple Pay outcome is based on the booking amount. Their current documentation says SAR 200.00–300.00 simulates success; other documented ranges simulate specific failures. A real card must be present in the Apple Wallet, but no real charge should occur while the StreamPay organization is in sandbox mode.

## Controlled live test

Only after every sandbox case passes:

1. Deploy the migration and secrets to production, with `STREAMPAY_EXPECTED_SANDBOX=false`.
2. Verify `/me` through the application accepts the live organization.
3. Enable checkout for internal staff only.
4. Complete one low-value real booking approved by the team.
5. Verify the bank settlement, invoice, application record, webhook, booking confirmation, and internal owner amount.
6. Process the agreed refund workflow and verify the customer's bank result.
7. Expand access gradually while monitoring failed webhooks, unresolved orders, and `REFUND_PENDING` records.

## Refund limitation to keep manual

StreamPay's current documentation is inconsistent: the MCP page describes its refund tool as supporting full or partial refunds, while the public REST refund endpoint says it supports full refunds. Until StreamPay confirms the exact supported request field and demonstrates it in sandbox, Masaha should keep partial refunds in the internal manual queue and never guess an amount field.
