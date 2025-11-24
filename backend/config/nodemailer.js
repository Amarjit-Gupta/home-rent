import nodemailder from 'nodemailer';

const transporter = nodemailder.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.SMTP_EMAIL,
        pass:process.env.SMTP_PASS
    }
});

export default transporter;