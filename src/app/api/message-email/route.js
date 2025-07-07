import nodemailer from 'nodemailer';

export async function POST(req) {
  const { senderName, receiverEmail, receiverName, text } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${senderName}" <${process.env.EMAIL_USER}>`,
    to: receiverEmail,
    subject: `New Message from ${senderName}`,
    text: `${senderName} sent you a message: ${text}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('❌ Email error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
