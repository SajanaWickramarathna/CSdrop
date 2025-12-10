const nodemailer = require('nodemailer');
const User = require('../Models/user');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendVerificationEmail = async (email, token) => {
    const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`;
    const mailOptions = {
        from:  `"CS Drop" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify your CS Drop account',
        html: `<h3>Click the link below to verify your email:</h3>
           <a href=${verificationLink}>${verificationLink}</a>`,
    }
    return transporter.sendMail(mailOptions);
};

exports.sendAccountCredentitals = async (firstName,lastName,email,address,phone,password) => {
    const mailOptions = {
        from:  `"CS Drop" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your CS Drop Informations",
        html:`<h1>Welcome to CS Drop</h1><br><h3>Account Informations</h3>
            <br><p><b>Name: </b> ${firstName} ${lastName}</p>
            <p><b>Email: </b> ${email}</p>
            <p><b>Address: </b> ${address}</p>
            <p><b>Phone Number: </b> ${phone}</p>
            <p><b>Password: </b> ${password}</p>
            <br><p style="color:#540000">Please change your default password and Profile Picture</p>
            <p style="color:red">Verificaition link was sent to your email.Please check Inbox or Spam</p>*`,
    }
    return transporter.sendMail(mailOptions);
}


exports.sendResetPassword = async (email, token) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset/${token}`;
    const mailOptions = {
        from:  `"CS Drop" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset password of your CS Drop account',
        html: `<h3>Click the link below to reset your passwrod:</h3>
           <a href=${resetLink}>${resetLink}</a>`,
    }
    return transporter.sendMail(mailOptions);
};

