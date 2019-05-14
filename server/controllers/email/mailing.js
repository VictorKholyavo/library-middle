const nodemailer = require("nodemailer");

async function main(userId, mailInfo) {
	console.log(userId);
	console.log(mailInfo);
	// nodemailer.createTestAccount((err, account) => {
	// 	let transporter = nodemailer.createTransport(
	// 		{
	// 			service: "gmail",
	// 			// host: "smtp.gmail.com",
	// 			// port: 465,
	// 			// secure: true, // true for 465, false for other ports
	// 			auth: {
	// 				user: "victor130997@gmail.com", // generated ethereal user
	// 				pass: "13091997" // generated ethereal password
	// 			}
	// 		}
	// 	);
	// 	let mailOptions = {
	// 		from: '"victor" <victor130997@gmail.com>',
	// 		to: "victor.kholyavo@gmail.com",
	// 		subject: "Test",
	// 		text: "Hello world?",
	// 		html: "<b>Hello world?</b>"
	// 	};
	//
	// 	transporter.sendMail(mailOptions, (error, info) => {
	// 		if (error) {
	// 			return console.log(error);
	// 		}
	// 		console.log("Message %s sent: %s", info.messageId, info.response);
	// 		transporter.close();
	// 	});
	// });
}

module.exports = {
	main
};