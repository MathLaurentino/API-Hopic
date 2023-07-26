import * as nodemailer from "nodemailer";
// import { InternalServerError } from "./ApiErrors";

export const sendMail = (nome: string, email: string, uniqueString: string) => {

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "1ade9ad35bc3af",
            pass: "dc538e047a7be6" //dc538e047a7be6
        }
    });

    const mailOptions = {
        from: "matheuscalifornia29@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Confirmação de E-Mail", // Subject line
        text: "Olá, prezado(a) " + nome + ". Pressione <a href='http://localhost:3000/validateEmail/" + uniqueString + "'> Aqui </a> para ativar sua conta",
        html: "Olá, prezado(a) " + nome + ". Pressione <a href='http://localhost:3000/validateEmail/" + uniqueString + "'> Aqui </a> para ativar sua conta",
    };

    transport.sendMail(mailOptions, function(err){
        if (err) {
            console.log("Erro ao enviar Email: " + err );
        }
    });

};