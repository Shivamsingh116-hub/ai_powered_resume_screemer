const jwt = require('jsonwebtoken')
require('dotenv').config()
const VerifyToken = async (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).send({ message: "No token provided" })
    }
    try {
        const decodeToken =await jwt.verify(token, process.env.SECRET_KEY)
        if (!decodeToken) {
            return res.status(401).send({ message: "Invalid token" })
        }
        req.userData = decodeToken
        next()
    } catch (e) {
        if (e.name === "TokenExpiredError") {
            return res.status(401).send({ message: "Session expired! Login Again" })
        } else {
            return res.status(500).send({ message: "Internal server error" })
        }
    }

    
};
module.exports = { VerifyToken };