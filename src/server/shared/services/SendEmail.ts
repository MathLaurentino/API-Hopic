import * as nodemailer from "nodemailer";
// import { InternalServerError } from "./ApiErrors";

export const sendMail = (email: string, uniqueString: string) => {

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "1ade9ad35bc3af",
            pass: "dc538e047a7be6"
        }
    });

    const mailOptions = {
        from: "Loja", // sender address
        to: email, // list of receivers
        subject: "Cnnfirmação de E-Mail", // Subject line
        text: "Pressione <a href='http://localhost:3000/verify/" + uniqueString + "'> here </a> para verificar o seu email?", // plain text body
        html: "Pressione <a href='http://localhost:3000/verify/" + uniqueString + "'> here </a> para verificar o seu email?",
    };

    transport.sendMail(mailOptions);
    // transport.sendMail(mailOptions, function(error) {
    //     if (error) {
    //         // console.log(error);
    //         throw new InternalServerError();
    //     } else {
    //         console.log("mensagem enviada");
    //     }
    // });

};