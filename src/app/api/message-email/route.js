import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { senderName, receiverEmail, receiverName, text } = await req.json();

    if (!receiverEmail || !text) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Smart Derma Notification" <${process.env.EMAIL_USER}>`,
      to: receiverEmail,
      subject: `New Message from ${senderName}`,
      html: `
        <p>Hello <strong>${receiverName}</strong>,</p>
        <p>You have received a new message from <strong>${senderName}</strong>:</p>
        <blockquote style="border-left: 4px solid #ccc; margin: 10px 0; padding-left: 10px;">
          ${text}
        </blockquote>
        <p>Regards,<br/>Smart Derma Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true, info }), { status: 200 });
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return new Response(JSON.stringify({ error: 'Email sending failed' }), {
      status: 500,
    });
  }
}
