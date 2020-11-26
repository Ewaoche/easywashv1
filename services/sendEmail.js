const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//     service: process.env.SMTP_HOST,
//     // port: process.env.SMTP_PORT,
//     // service: 'Gmail',
//     auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASSWORD
//     },
// });

// const message = {
//     from: `${process.env.FROM_NAME}  <${process.env.FROM_EMAIL}>`,
//     to: options.email,
//     subject: options.subject,
//     text: options.message

// };

// transporter.sendMail(message, function(err, success) {
//     if (err) {
//         console.log('error occured: !', err);
//     } else {
//         console.log('email sent !');

//     }

// })



const sendEmail = async(options) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        // port: process.env.SMTP_PORT,
        // service: 'Gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    // send mail with defined transport object

    const message = {
        from: `${process.env.FROM_NAME}  <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message

    };
    const info = await transporter.sendMail(message)

    console.log("Message sent: %s", info.messageId);

}

module.exports = sendEmail;