import { mailTransporter, FRONTEND_URL } from './mail.config';

// Evita che caratteri speciali nel nome (es. < > &) rompano l'HTML della mail
const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const BRAND = 'Banca Lume';

export class MailService {
    //inviaEmailConferma: manda la mail con il link di conferma registrazione al confirmationToken generato da UserService.add
    async inviaEmailConferma(email: string, nomeTitolare: string, confirmationToken: string): Promise<void> {
        const confirmUrl = new URL(`/confirm/${confirmationToken}`, FRONTEND_URL).toString();
        const nome = escapeHtml(nomeTitolare);

        await mailTransporter.sendMail({
            from: `"${BRAND}" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
            to: email,
            subject: `Conferma la tua registrazione a ${BRAND}`,
            // versione testuale di riserva (client che non mostrano l'HTML)
            text: `Ciao ${nomeTitolare},\n\nPer completare la registrazione conferma il tuo indirizzo email da questo link:\n${confirmUrl}\n\nIl link scade tra 24 ore.`,
            html: `
<div style="background:#f1f5f9; padding:32px 12px; font-family:Arial, Helvetica, sans-serif;">
  <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e2e8f0;">

    <div style="background:#0f172a; padding:22px 28px;">
      <span style="color:#3b82f6; font-size:24px; font-weight:800; letter-spacing:-0.01em;">${BRAND}</span>
    </div>

    <div style="padding:32px 28px; color:#334155; font-size:15px; line-height:1.6;">
      <h2 style="margin:0 0 16px; color:#0f172a; font-size:22px;">Ciao ${nome}!</h2>
      <p style="margin:0 0 8px;">Grazie per esserti registrato.</p>
      <p style="margin:0 0 28px;">Per attivare il tuo conto conferma il tuo indirizzo email cliccando sul pulsante:</p>

      <p style="margin:0 0 28px; text-align:center;">
        <a href="${confirmUrl}"
           style="display:inline-block; background:#2563eb; color:#ffffff; padding:14px 32px; border-radius:8px; text-decoration:none; font-weight:700; font-size:16px;">
          Conferma email
        </a>
      </p>

      <p style="margin:0 0 6px; font-size:13px; color:#64748b;">Il pulsante non funziona? Copia e incolla questo link nel browser:</p>
      <p style="margin:0 0 24px; font-size:13px; word-break:break-all;">
        <a href="${confirmUrl}" style="color:#2563eb;">${confirmUrl}</a>
      </p>

      <p style="margin:0; font-size:13px; color:#64748b;">Il link scade tra 24 ore. Se non hai richiesto tu la registrazione, ignora questa mail.</p>
    </div>

    <div style="background:#f8fafc; padding:16px 28px; border-top:1px solid #e2e8f0; font-size:12px; color:#94a3b8; text-align:center;">
      &copy; ${new Date().getFullYear()} ${BRAND}
    </div>

  </div>
</div>`,
        });
    }
}

export default new MailService();

/*import { mailTransporter, FRONTEND_URL } from './mail.config';

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

export default new MailService();*/