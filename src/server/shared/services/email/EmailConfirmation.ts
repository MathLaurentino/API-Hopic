import * as nodemailer from "nodemailer";
import "dotenv/config";
import logger from "../logger";

export const EmailConfirmation = (nome: string, email: string, uniqueString: string) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const confirmacaoLink = process.env.NODE_ENV === "production" ? 
        `https://hopic.store/validateEmail/${uniqueString}` : 
        `http://localhost:${process.env.PORT}/validateEmail/${uniqueString}`;

    const mailOptions = {
        from: "hopic.store@gmail.com",
        to: email,
        subject: "Confirmação de Cadastro - hopic.store",
        text: `Olá ${nome},\n\nObrigado por se cadastrar na hopic.store! Clique no link a seguir para confirmar seu cadastro:
                \n${confirmacaoLink}\n\nSe você não se cadastrou em nosso site, por favor, ignore este e-mail.\n`,
        html: corpoHTML(nome, confirmacaoLink),
    };

    transport.sendMail(mailOptions, function(err){
        if (err) {
            logger.warn("Falha ao enviar e-mail de confirmação ao e-mail " + email + "\n" + err);
        }
    });

};

const corpoHTML = (nome: string, confirmacaoLink: string): string => {
    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>EConfirmação de Cadastro</title>
        </head>
        <body style="background-color: #f2f2f2; margin: 0; padding: 0; font-family: Arial, sans-serif;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                    <td style="text-align: center;">
                        <div style="padding: 20px;">
                            <h1 style="color: #333;">Confirmação de Cadastro - hopic.store</h1>
                            <p style="color: #333;">Olá ${nome},</p>
                            <p>Obrigado por se cadastrar na hopic.store! Clique no link abaixo para confirmar seu cadastro:</p>
                            <p><a href="${confirmacaoLink}" style="text-decoration: none; background-color: #007bff; color: #fff; padding: 10px 20px; border-radius: 5px;">Confirmar Cadastro</a></p>
                            <p>Se você não se cadastrou em nosso site, por favor, ignore este e-mail.</p>
                        </div>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
};