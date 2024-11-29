const sendEmail = require('./sendEmail')

const sendResetPasswordEmail = async ({name, email, token, origin}) => {
    const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`
    const message = `<p>please reset your password by clicking on the following link. <a href="${resetURL}">reset password</a></p>`

    return sendEmail({
        to: email,
        subject: 'reset password',
        html: `<h4>Hello, ${name}</h4>
        ${message}
        `
    })
}

const sendForgotPasswordEmail = async ({name, email, token, origin}) => {
    const resetURL = `${origin}/auth/reset-password?token=${token}&email=${email}`
    const message =  `<p>forgot your password? submit a patch request with your new password and password confirm to <a href="${resetURL}">reset password</a>.
   \n if you didn't forget your password please ignore this email</p> `;

    return sendEmail({
        to: email,
        subject: 'Forgot password',
        html: `<h4>Hello, ${name}</h4>
        ${message}
        `
    })
}

module.exports = {sendResetPasswordEmail,sendForgotPasswordEmail}