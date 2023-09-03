import * as nodemailer from "nodemailer";
import "dotenv/config";
import logger from "../logger";

export const EmailNewPassWord = (nome: string, email: string, uniqueString: string) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });


    const linkRedefinicao = process.env.NODE_ENV === "production" ? 
        `https://hopic.store/newPassword/${uniqueString}` : 
        `http://localhost:${process.env.PORT}/newPassword/${uniqueString}`;

    
    const mailOptions = {
        from: "matheuscalifornia29@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Confirmação de E-Mail", // Subject line
        text: `Olá ${nome}, Recebemos uma solicitação para redefinir a senha da sua conta na hopic.store. 
            Clique no link abaixo para continuar o processo de redefinição de senha: <a href='${linkRedefinicao}'>
            Se você não solicitou a redefinição de senha, pode ignorar este e-mail. Atenciosamente,Equipe hopic.store`,
        html: corpoHTML(nome, linkRedefinicao)
    };

    transport.sendMail(mailOptions, function(err){
        if (err) {
            logger.warn("Falha ao enviar e-mail de redefinição de senha ao e-mail " + email + "\n" + err);
        }
    });

};


const corpoHTML = (nome: string, linkRedefinicao: string): string => {
    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Redefinição de Senha - hopic.store</title>
        </head>
        <body style="background-color: #f2f2f2; margin: 0; padding: 0; font-family: Arial, sans-serif;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                    <td style="text-align: center;">
                        <div style="padding: 20px;">
                            <h1 style="color: #333;">Redefinição de Senha - hopic.store</h1>
                            <p>Olá ${nome},</p>
                            <p>Recebemos uma solicitação para redefinir a senha da sua conta na hopic.store. Clique no link abaixo para continuar o processo de redefinição de senha:</p>
                            <p><a href="${linkRedefinicao}" style="text-decoration: none; background-color: #007bff; color: #fff; padding: 10px 20px; border-radius: 5px;">Redefinir Senha</a></p>
                            <p>Se você não solicitou a redefinição de senha, pode ignorar este e-mail.</p>
                            <p>Atenciosamente,<br>Equipe hopic.store</p>
                        </div>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
};

