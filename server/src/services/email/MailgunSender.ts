process.loadEnvFile();
import FormData from 'form-data'; // form-data v4.0.1
import Mailgun from 'mailgun.js'; // mailgun.js v11.1.0
import { SendMailProps } from './mailSender';

export default async function sendMailFromMailgun(mailProps: SendMailProps) {
  const { sender, recipient, subject, text, html } = mailProps;
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY as string,
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net"
  });
  try {
    const data = await mg.messages.create('studytimerapp.com', {
      from: 'Study Timer App <no-reply@studytimerapp.com>',
      to: [`<${recipient}>`],
      subject: subject,
      text: text,
      html: html,
    });

    return data;
  } catch (error: any) {
    console.log(error); //logs any error
    throw new Error(error);
  }
}
