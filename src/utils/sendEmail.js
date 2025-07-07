import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, cc = '' }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Ai Derma 👨‍⚕️" <${process.env.EMAIL_USER}>`,
      to,
      cc,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📤 Email sent:', info.response);
  } catch (error) {
    console.error('❌ Email failed:', error);
    throw new Error('Email failed to send');
  }
};
