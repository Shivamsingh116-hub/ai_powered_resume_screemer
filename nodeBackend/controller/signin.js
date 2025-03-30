const bcrypt = require('bcryptjs');
const UserDataModel = require('../database/userData');
require('dotenv').config()
const jwt = require('jsonwebtoken')
const SignIn = async (req, res) => {
    const { email, password } = req.body;
    const isUser = await UserDataModel.findOne({ email })
    if (!isUser) {
        return res.status(400).send({ message: "User does not exist" })
    }
    if (!email || !password) {
        return res.status(400).send({ message: "Please fill all the fields" })
    }
    const comparePassword =bcrypt.compareSync(password, isUser.password);
    if (!comparePassword) {
        return res.status(400).send({ message: "Invalid credentials" })
    }
    const token = jwt.sign({ id: isUser._id, email: isUser.email, name: isUser.name, role: isUser.role, resume: isUser.resume }, process.env.SECRET_KEY, { expiresIn: '1h' })
    if (!token) {
        return res.status(500).send({ message: "Internal server error" })
    };
    res.status(200).send({ message: "Sign-in successful", token });
}
const SigninUserData = (req, res) => {
    const data = req.userData
    if (!data) {
        return res.status(400).send({ message: "User data not found" })
    }

    res.status(200).send({ message: "User data received successfully", user: data })
}


module.exports = { SignIn, SigninUserData }