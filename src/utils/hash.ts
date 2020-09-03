const bcrypt = require('bcrypt')

const encrypt = async (pass: string) => {
	const encrypted = bcrypt.hash(pass, 10)
	return encrypted
}
	
const compare = async (pass: string, encrypted: string) => {
	const checked = bcrypt.compare(pass, encrypted)
	return checked
}

module.exports = {
	encrypt,
	compare
}