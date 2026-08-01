import { Resend } from 'resend'
import { getSiteUrl } from '@/lib/site'

let client: Resend | null = null

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')
  if (!client) client = new Resend(apiKey)
  return client
}

function getFromAddress() {
  return process.env.EMAIL_FROM || 'إحياء مساحة <no-reply@ehyamesaha.sa>'
}

function emailShell(bodyHtml: string) {
  const logoUrl = `${getSiteUrl()}/brand/logo-horizontal-green.png`
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>إحياء مساحة</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F5F1E8;font-family:Tahoma,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F1E8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E4DED1;">
            <tr>
              <td align="center" style="background-color:#0E3B34;padding:28px 24px;">
                <img src="${logoUrl}" alt="إحياء مساحة" height="32" style="height:32px;display:block;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 24px 32px;text-align:right;color:#1B1B1B;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#FAF8F3;border-top:1px solid #E4DED1;text-align:center;">
                <p style="margin:0;font-size:12px;color:#8B9389;">© ${new Date().getFullYear()} إحياء مساحة · ehyamesaha.sa</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export async function sendConfirmationEmail({ to, name, confirmUrl }: { to: string; name: string; confirmUrl: string }) {
  const html = emailShell(`
    <h1 style="margin:0 0 16px 0;font-size:20px;font-weight:800;color:#1B1B1B;">أكّد بريدك الإلكتروني</h1>
    <p style="margin:0 0 20px 0;font-size:14px;line-height:24px;color:#3F4B47;">
      مرحبًا ${escapeHtml(name)}، شكرًا لتسجيلك في إحياء مساحة. لتفعيل حسابك والبدء في الحجز، يرجى تأكيد بريدك الإلكتروني بالضغط على الزر أدناه.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;">
      <tr>
        <td align="center" style="border-radius:12px;background-color:#0E3B34;">
          <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">تأكيد البريد الإلكتروني</a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 8px 0;font-size:12px;line-height:20px;color:#8B9389;">أو انسخ الرابط التالي والصقه في المتصفح:</p>
    <p dir="ltr" style="margin:0 0 20px 0;font-size:12px;line-height:20px;color:#0E3B34;word-break:break-all;text-align:left;">${confirmUrl}</p>
    <p style="margin:0;font-size:12px;line-height:20px;color:#8B9389;">هذا الرابط صالح لمدة 48 ساعة. إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة بأمان.</p>
  `)

  return getResendClient().emails.send({
    from: getFromAddress(),
    to,
    subject: 'تأكيد بريدك الإلكتروني - إحياء مساحة',
    html,
  })
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] as string))
}
