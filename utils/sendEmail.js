const nodemailer = require('nodemailer');
const transporterConfig = require('./nodemailerConfig')

const sendEmail = async ({to,subject,html}) => {
    const testAccount = await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport(transporterConfig);

    return  transporter.sendMail({
        from: '"Mohsen 👻" <mohsen@ethereal.email>', // sender address
        to,subject,html
    });
}

module.exports = sendEmail;