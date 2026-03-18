// lib/email-template.ts

const BRAND = {
  name: "СітіЧЕ",
  tagline: "Єдине вікно для взаємодії з Черкасами",
  year: new Date().getFullYear(),
}

function emailShell(content: string): string {
  return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:48px 16px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e4e7ec;max-width:520px;width:100%;box-shadow:0 4px 32px rgba(0,0,0,0.07);">

          <!-- Header -->
          <tr>
            <td style="padding:0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 60%,#3b82f6 100%);padding:44px 48px 40px;text-align:center;">
                    <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.25);border-radius:16px;padding:10px 24px;margin-bottom:16px;">
                      <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.3px;">СітіЧЕ</span>
                    </div>
                    <p style="margin:0;color:rgba(255,255,255,0.6);font-size:13px;letter-spacing:0.03em;">${BRAND.tagline}</p>
                  </td>
                </tr>
                <tr>
                  <td style="height:4px;background:linear-gradient(90deg,#f59e0b,#f97316,#ef4444);"></td>
                </tr>
              </table>
            </td>
          </tr>

          ${content}

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px 32px;border-top:1px solid #f1f3f7;">
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.7;text-align:center;">
                Якщо ти не очікував цього листа — просто ігноруй його, нічого не станеться.<br/>
                © ${BRAND.year} ${BRAND.name}, Черкаси
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/* ─────────────────────────────────────────────────────────────
   Magic Link Email
───────────────────────────────────────────────────────────── */
export function magicLinkEmail({ url, host }: { url: string; host: string }) {
  const content = `
    <tr>
      <td style="padding:44px 48px 12px;">
        <h2 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:700;line-height:1.3;">
          Увійдіть до свого акаунту
        </h2>
        <p style="margin:0 0 32px;color:#6b7280;font-size:15px;line-height:1.7;">
          Натисніть кнопку нижче щоб увійти в адмін-панель <strong style="color:#111827;">${host}</strong>.
          Посилання діє <strong style="color:#111827;">24 години</strong> і лише для одного входу.
        </p>

        <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#3b82f6);border-radius:12px;box-shadow:0 4px 16px rgba(37,99,235,0.25);">
              <a href="${url}" style="display:inline-block;padding:15px 44px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.01em;">
                Увійти в СітіЧЕ →
              </a>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 12px;">
          <tr>
            <td style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:14px 20px;">
              <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">
                ⏳ <strong>Посилання одноразове</strong> — після входу воно стане недійсним. Не передавай його іншим.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:12px 48px 36px;">
        <p style="margin:0 0 6px;color:#9ca3af;font-size:12px;">Якщо кнопка не працює, скопіюй посилання:</p>
        <a href="${url}" style="color:#2563eb;font-size:12px;word-break:break-all;">${url}</a>
      </td>
    </tr>
  `

  return {
    subject: `Вхід до ${BRAND.name} · ${host}`,
    html: emailShell(content),
    text: `Увійти на ${host}: ${url}\n\nПосилання діє 24 години і лише для одного входу.`,
  }
}

/* ─────────────────────────────────────────────────────────────
   Invite Admin Email
───────────────────────────────────────────────────────────── */
export function inviteAdminEmail({ url, host, invitedBy }: { url: string; host: string; invitedBy?: string }) {
  const introText = invitedBy
    ? `<strong style="color:#111827;">${invitedBy}</strong> запрошує тебе стати адміністратором порталу ${BRAND.name} — міського інформаційного ресурсу Черкас.`
    : `Тебе запрошено стати адміністратором порталу ${BRAND.name} — міського інформаційного ресурсу Черкас.`

  const content = `
    <tr>
      <td style="padding:44px 48px 12px;">

        <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          <tr>
            <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:999px;padding:6px 16px;">
              <span style="color:#1d4ed8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">✦ &nbsp;Запрошення адміністратора</span>
            </td>
          </tr>
        </table>

        <h2 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:700;line-height:1.3;">
          Тебе запрошено до команди
        </h2>
        <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.7;">
          ${introText}
        </p>

        <table cellpadding="0" cellspacing="0" width="100%" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;margin:0 0 32px;">
          <tr>
            <td style="padding:16px 24px 12px;border-bottom:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">Що ти отримуєш</p>
            </td>
          </tr>
          <tr>
            <td style="padding:13px 24px;color:#374151;font-size:14px;line-height:1.5;">
              <span style="color:#f59e0b;margin-right:10px;">▸</span>Доступ до адмін-панелі порталу
            </td>
          </tr>
          <tr>
            <td style="padding:13px 24px;color:#374151;font-size:14px;line-height:1.5;border-top:1px solid #f3f4f6;">
              <span style="color:#f59e0b;margin-right:10px;">▸</span>Керування категоріями та ресурсами
            </td>
          </tr>
          <tr>
            <td style="padding:13px 24px;color:#374151;font-size:14px;line-height:1.5;border-top:1px solid #f3f4f6;">
              <span style="color:#f59e0b;margin-right:10px;">▸</span>Модерація звернень від мешканців
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#3b82f6);border-radius:12px;box-shadow:0 4px 16px rgba(37,99,235,0.25);">
              <a href="${url}" style="display:inline-block;padding:15px 44px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.01em;">
                Прийняти запрошення →
              </a>
            </td>
          </tr>
        </table>

        <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 12px;">
          <tr>
            <td style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:14px 20px;">
              <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">
                ⏳ <strong>Посилання діє 48 годин</strong> і призначено лише для тебе. Не передавай його іншим.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:12px 48px 36px;">
        <p style="margin:0 0 6px;color:#9ca3af;font-size:12px;">Якщо кнопка не працює, скопіюй посилання:</p>
        <a href="${url}" style="color:#2563eb;font-size:12px;word-break:break-all;">${url}</a>
      </td>
    </tr>
  `

  return {
    subject: `Запрошення до команди адміністраторів ${host}`,
    html: emailShell(content),
    text: `Тебе запрошено до команди адміністраторів ${BRAND.name}.\n\nПрийняти запрошення: ${url}\n\nПосилання діє 48 годин.`,
  }
}
