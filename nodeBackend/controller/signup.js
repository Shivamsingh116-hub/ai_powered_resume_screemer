const UserDataModel = require("../database/userData")
const bcrypt = require("bcrypt")
const SignUp = async (req, res) => {
    const { name, email, password } = req.body
    const isUser = await UserDataModel.findOne({ email })
    if (isUser) {
        return res.status(400).send({ message: "User already exists" })
    }
    if (!name || !email || !password) {
        return res.status(400).send({ message: "Please fill all the fields" })
    }
    const hashedPassword = await hashPassword(password)
    const newUser = await UserDataModel.create({ name, email, password: hashedPassword })
    if (!newUser) {
        return res.status(500).send({ message: "Internal server error" })
    }
    res.status(200).send({ message: "Signed in successfully" })
}
const hashPassword =  (password) => {
    const saltRounds =bcrypt.genSaltSync(12)
    const hashedPassword = bcrypt.hashSync(password, saltRounds)
    return hashedPassword
}
module.exports = { SignUp }