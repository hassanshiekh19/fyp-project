import { sendEmail } from '@/utils/sendEmail';

export async function POST(req) {
  try {
    const { to, cc, name } = await req.json();
    console.log("📥 Email Payload:", { to, cc, name });

    const subject = '🔐 Login Notification - Ai Derma';

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #4F46E5;">👋 Welcome to Ai Derma</h2>
        <p>Hello <strong>${name || 'User'}</strong>,</p>
        <p>You have successfully logged in to <strong>Ai Derma (Smart Derma Solutions)</strong>.</p>
        <p>If this wasn’t you, please click below to reset your password:</p>
<center style="margin: 20px 0;">
  <a href="http://localhost:3000/login/forgot-password"
     target="_blank"
     style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none;
            border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
    Reset Password
  </a>
</center>

        <hr style="margin: 30px 0;" />
        <p style="font-size: 12px; color: #888;">This is an automated email from Ai Derma. Do not reply.</p>
      </div>
    `;

    await sendEmail({ to, subject, html, cc });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Email error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send email.' }), {
      status: 500,
    });
  }
}
