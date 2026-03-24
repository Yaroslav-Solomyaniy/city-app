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

async function send(to: string, subject: string, html: string, text: string) {
  const transport = createTransport()
  try {
    await transport.sendMail({ from: process.env.EMAIL_FROM, to, subject, html, text })
  } catch (error) {
    console.error(`[mailer] Failed to send email to ${to}:`, error)
    throw new Error("Failed to send email")
  }
}

export async function sendInviteEmail({ to, url, host, invitedBy }: { to: string; url: string; host: string; invitedBy?: string }) {
  const { subject, html, text } = inviteAdminEmail({ url, host, invitedBy })
  await send(to, subject, html, text)
}
