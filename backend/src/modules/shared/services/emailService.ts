import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailAttachment {
    filename: string;
    content: string | Buffer;
    contentType: string;
    encoding?: string;
  }

const sendEmail = async (to: string, subject: string, html: string, attachments: EmailAttachment[]) => {
  try {
    const data = await resend.emails.send({
      from: 'The Republic <noreply@the-republic.co.za>',
      to: [to],
      subject,
      html,
      attachments,
    });

    console.log('Email sent:', data);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export { sendEmail };