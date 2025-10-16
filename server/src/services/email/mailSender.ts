process.loadEnvFile();
import * as nodemailer from 'nodemailer';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
const sesClient = new SESv2Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_SES_SMTP_USERNAME as string,
    secretAccessKey: process.env.AWS_SES_SMTP_PASSWORD as string,
  },
});

const awsTransportLayer = nodemailer.createTransport({
  SES: {
    sesClient,
    SendEmailCommand,
  },
});

export interface SendMailProps {
  sender: string;
  recipient: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(mailProps: SendMailProps) {
  const { sender, recipient, subject, text, html } = mailProps;
  try {
    console.log('Attempting to send email...');

    const response = await awsTransportLayer.sendMail({
      from: sender || 'no-reply@studytimerapp.com',
      to: recipient,
      subject: subject,
      text: text,
      html: html,
    });

    console.log('Email sent successfully!');
    console.log('Envelope:', response.envelope);
    console.log('Message ID:', response.messageId);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
