import { Resend } from 'resend';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const FROM_ADDRESS = process.env.EMAIL_FROM || 'Octokeen <noreply@octokeen.com>';

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  // Development: log to console for easy debugging
  if (process.env.NODE_ENV === 'development' && !process.env.RESEND_API_KEY) {
    console.log('\n========== EMAIL ==========');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(html.replace(/<[^>]+>/g, ''));
    console.log('===========================\n');
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — email not sent:', { to, subject });
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
  if (error) {
    console.error('[email] Failed to send:', error);
    throw new Error(`Email send failed: ${error.message}`);
  }
}
