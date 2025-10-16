import EmailValidation from '../../models/EmailValidationModel';
import { ValidationCodeEmailTemplate } from './ValidationCodeEmailTemplate';
import { sendEmail } from './mailSender';
import sendMailFromMailgun from './MailgunSender';

export default async function sendValidationCode(senderEmail: string, userEmail: string): Promise<boolean | string> {
  try {
    const validationCode = (Math.floor(Math.random() * 9000) + 1000).toString();
    const validationDocument = await EmailValidation.create({
      email: userEmail,
      validationCode,
    });
    validationDocument.save();
    const html = ValidationCodeEmailTemplate.generateTemplate(validationCode);
    const text = ValidationCodeEmailTemplate.generateTextTemplate(validationCode);
    const id: string = validationDocument._id as string;
    sendMailFromMailgun({
      sender: senderEmail,
      recipient: userEmail,
      subject: `${validationCode} is your StudyTimer app activation code `,
      html,
      text,
    });
    return id;
  } catch (error) {
    console.log(error);
    return false;
  }
}
