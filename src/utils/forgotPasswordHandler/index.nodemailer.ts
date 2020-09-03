const { 

	HOST,
	PORT,
	NODEMAILER_HOST,
	NODEMAILER_PORT,
	NODEMAILER_TRANSPORTER,
	NODEMAILER_PASS

} = process.env

const nodemailer = require('nodemailer')

//using gmail to send your email
const transporter = nodemailer.createTransport({
	host: NODEMAILER_HOST,
	port: NODEMAILER_PORT,
	secure: false,
	auth: {
		user: NODEMAILER_TRANSPORTER,
		pass: NODEMAILER_PASS
	},
	tls: {
		rejectUnauthorized: false
	}
})

//using Mailtrap

/*var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8609e137918c08",
    pass: "040d26b7136ef9"
  }
});*/

const sendMail = async function run(email:string, token:string) {
	try {
		const message = await transporter.sendMail({
			html: `
				<p>Para redefinir sua senha, utilize este código <em>${token}</em>.</p><br>
				<p>Se você não solicitou este email, por favor ignore-o.</p>
			`,
			subject: 'PROFFY - Redefinição de senha',
			from: `EU <${NODEMAILER_TRANSPORTER}>`,
			to: `${email}`
		})
	} catch (err) {
		console.log(err)
	}	
}

/*const verifyTransporter = transporter.verify( (error, success) => {
	if(error) {
		console.log('Something went wrong' + error)
	} else {
		console.log('Server is ready to take our messages')
	}
})*/

module.exports = {
	sendMail
}


