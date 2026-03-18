import nodemailer from "nodemailer"
import { magicLinkEmail, inviteAdminEmail } from "@/lib/email-template"

function createTransport() {
  const port = Number(process.env.EMAIL_SERVER_PORT ?? 465)
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

export async function sendMagicLink({ to, url, host }: { to: string; url: string; host: string }) {
  const transport = createTransport()
  await transport.verify()
  const { subject, html, text } = magicLinkEmail({ url, host })
  await transport.sendMail({ from: process.env.EMAIL_FROM, to, subject, html, text })
}

export async function sendInviteEmail({ to, url, host, invitedBy }: { to: string; url: string; host: string; invitedBy?: string }) {
  const transport = createTransport()
  await transport.verify()
  const { subject, html, text } = inviteAdminEmail({ url, host, invitedBy })
  await transport.sendMail({ from: process.env.EMAIL_FROM, to, subject, html, text })
}
