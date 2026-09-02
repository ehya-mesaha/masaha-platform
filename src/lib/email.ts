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
  return process.env.EMAIL_FROM || 'مساحة <no-reply@ehyamesaha.sa>'
}

function emailShell(bodyHtml: string) {
  // White lockup — the email header band is brand green.
  const logoUrl = `${getSiteUrl()}/brand/logo-horizontal-white.png`
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>مساحة</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F5F1E8;font-family:Tahoma,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F1E8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E4DED1;">
            <tr>
              <td align="center" style="background-color:#0E3B34;padding:28px 24px;">
                <img src="${logoUrl}" alt="مساحة" height="34" style="height:34px;display:block;" />
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
      مرحبًا ${escapeHtml(name)}، شكرًا لتسجيلك في مساحة. لتفعيل حسابك والبدء في الحجز، يرجى تأكيد بريدك الإلكتروني بالضغط على الزر أدناه.
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
    subject: 'تأكيد بريدك الإلكتروني - مساحة',
    html,
  })
}

export async function sendPasswordResetEmail({ to, name, resetUrl }: { to: string; name: string; resetUrl: string }) {
  const html = emailShell(`
    <h1 style="margin:0 0 16px 0;font-size:20px;font-weight:800;color:#1B1B1B;">إعادة تعيين كلمة المرور</h1>
    <p style="margin:0 0 20px 0;font-size:14px;line-height:24px;color:#3F4B47;">
      مرحبًا ${escapeHtml(name)}، تلقّينا طلبًا لإعادة تعيين كلمة مرور حسابك في مساحة. اضغط على الزر أدناه لاختيار كلمة مرور جديدة.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;">
      <tr>
        <td align="center" style="border-radius:12px;background-color:#0E3B34;">
          <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">تعيين كلمة مرور جديدة</a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 8px 0;font-size:12px;line-height:20px;color:#8B9389;">أو انسخ الرابط التالي والصقه في المتصفح:</p>
    <p dir="ltr" style="margin:0 0 20px 0;font-size:12px;line-height:20px;color:#0E3B34;word-break:break-all;text-align:left;">${resetUrl}</p>
    <p style="margin:0;font-size:12px;line-height:20px;color:#8B9389;">هذا الرابط صالح لمدة ساعة واحدة ويُستخدم مرة واحدة. إذا لم تطلب تغيير كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.</p>
  `)

  return getResendClient().emails.send({
    from: getFromAddress(),
    to,
    subject: 'إعادة تعيين كلمة المرور - مساحة',
    html,
  })
}

export async function sendContactMessageEmail({
  type,
  name,
  email,
  phone,
  subject,
  message,
}: {
  type: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
}) {
  const typeLabel = ({ INQUIRY: 'استفسار', SUGGESTION: 'اقتراح', COMPLAINT: 'شكوى' } as Record<string, string>)[type] || type
  const safeSubject = subject || 'رسالة تواصل جديدة'
  const html = emailShell(`
    <h1 style="margin:0 0 16px 0;font-size:20px;font-weight:800;color:#1B1B1B;">رسالة تواصل جديدة</h1>
    <p style="margin:0 0 20px 0;font-size:14px;line-height:24px;color:#3F4B47;">تم استلام رسالة جديدة من نموذج التواصل في الموقع.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px 0;border-collapse:collapse;">
      <tr><td style="padding:8px 0;font-weight:700;color:#5F6764;">نوع الرسالة</td><td style="padding:8px 0;color:#1B1B1B;">${escapeHtml(typeLabel)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:700;color:#5F6764;">الاسم</td><td style="padding:8px 0;color:#1B1B1B;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:700;color:#5F6764;">البريد</td><td dir="ltr" style="padding:8px 0;color:#1B1B1B;text-align:right;">${escapeHtml(email)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:700;color:#5F6764;">الجوال</td><td dir="ltr" style="padding:8px 0;color:#1B1B1B;text-align:right;">${escapeHtml(phone || 'غير مذكور')}</td></tr>
      <tr><td style="padding:8px 0;font-weight:700;color:#5F6764;">الموضوع</td><td style="padding:8px 0;color:#1B1B1B;">${escapeHtml(safeSubject)}</td></tr>
    </table>
    <div style="border-radius:12px;background:#F5F1E8;padding:16px;white-space:pre-wrap;font-size:14px;line-height:26px;color:#1B1B1B;">${escapeHtml(message)}</div>
  `)

  return getResendClient().emails.send({
    from: getFromAddress(),
    to: 'info@ehyamesaha.sa',
    replyTo: email,
    subject: `[${typeLabel}] ${safeSubject}`,
    text: `نوع الرسالة: ${typeLabel}\nالاسم: ${name}\nالبريد: ${email}\nالجوال: ${phone || 'غير مذكور'}\nالموضوع: ${safeSubject}\n\n${message}`,
    html,
  })
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] as string))
}
