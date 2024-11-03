const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({name, email, verificationToken, origin}) => {
    const verifyEmail = `${origin}/auth/verify-email?token=${verificationToken}&email=${email}`;
    const message = `<p>Please confirm your Email by clicking on following link : <a href="${verifyEmail}">Verify Email</a></p>`

    return sendEmail({
        to: email,
        subject: 'Confirmation Email',
        html: `<h4>Hello, ${name}</h4>
        ${message}
        `,
    })
}

module.exports = sendVerificationEmail;