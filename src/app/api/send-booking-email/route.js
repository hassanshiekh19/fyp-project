import { sendEmail } from '@/utils/sendEmail';

export async function POST(req) {
  try {
    const { doctorEmail, patientEmail, patientName, doctorName, date, time, reason } = await req.json();

    const subject = `📅 New Appointment - Ai Derma`;

    const readableDate = new Date(date).toLocaleString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

    const htmlForDoctor = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #4F46E5;">📢 New Appointment Request</h2>
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Date:</strong> ${readableDate}</p> 
        <p><strong>Time:</strong> ${time}</p> 
        <hr style="margin: 30px 0;" />
        <p style="font-size: 12px; color: #888;">This is an automated message from Ai Derma. Please login to view full details.</p>
      </div>
    `;

    const htmlForPatient = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #4F46E5;">✅ Booking Confirmed</h2>
        <p>Hello <strong>${patientName}</strong>,</p>
        <p>Your appointment with <strong>${doctorName}</strong> has been successfully booked.</p>
        <p><strong>Date:</strong> ${readableDate}</p>
        <p><strong>Time:</strong> ${time}</p> 
        <p><strong>Reason:</strong> ${reason}</p>
        <center style="margin: 20px 0;">
          <a href="https://aiderma.com/login"
             style="background-color: #4F46E5; color: white; padding: 12px 24px;
                    text-decoration: none; border-radius: 6px; font-weight: bold;">
            View Booking
          </a>
        </center>
        <hr style="margin: 30px 0;" />
        <p style="font-size: 12px; color: #888;">This is an automated confirmation from Ai Derma. Do not reply.</p>
      </div>
    `;

    // Send to Doctor
    await sendEmail({
      to: doctorEmail,
      cc: 'admin@aiderma.com',
      subject,
      html: htmlForDoctor,
    });

    // Send to Patient
    await sendEmail({
      to: patientEmail,
      cc: 'admin@aiderma.com',
      subject,
      html: htmlForPatient,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Booking Email Error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send emails.' }), { status: 500 });
  }
}
