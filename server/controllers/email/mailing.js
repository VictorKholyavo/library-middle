const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
	nodemailer.createTestAccount((err, account) => {
		let transporter = nodemailer.createTransport(
			{
				host: account.smtp.host,
				port: account.smtp.port,
				secure: account.smtp.secure, // true for 465, false for other ports
				auth: {
					user: account.user, // generated ethereal user
					pass: account.pass // generated ethereal password
				}
			},
			{
				from: 'Nodemailer <example@nodemailer.com>'
			}
		);
		let mailOptions = {
			// from: 'victor <victor.kholyavo@gmail.com>', // sender address
			to: "victor130997@gmail.com", // list of receivers
			subject: "Test", // Subject line
			text: "Hello world?", // plain text body
			html: "<b>Hello world?</b>" // html body
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log("Message %s sent: %s", info.messageId, info.response);
			transporter.close();
		});
	});
}

module.exports = {
	main
};