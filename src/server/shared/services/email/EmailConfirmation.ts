import * as nodemailer from "nodemailer";
import "dotenv/config";

export const EmailConfirmation = (nome: string, email: string, uniqueString: string) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
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