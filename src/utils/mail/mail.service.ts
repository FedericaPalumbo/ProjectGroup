import { mailTransporter, FRONTEND_URL } from './mail.config';

export class MailService {
    //inviaEmailConferma: manda la mail con il link di conferma registrazione al confirmationToken generato da UserService.add
    async inviaEmailConferma(email: string, nomeTitolare: string, confirmationToken: string): Promise<void> {
        const confirmUrl = new URL(`/confirm/${confirmationToken}`, FRONTEND_URL).toString();

        await mailTransporter.sendMail({
            from: process.env.MAIL_FROM || process.env.MAIL_USER,
            to: email,
            subject: 'Conferma la tua registrazione',
            html: `
        <p>Ciao ${nomeTitolare},</p>
        <p>Per completare la registrazione conferma il tuo indirizzo email cliccando sul link seguente:</p>
        <p><a href="${confirmUrl}">${confirmUrl}</a></p>
        <p>Il link scade tra 24 ore.</p>
      `,
        });
    }
}

export default new MailService();