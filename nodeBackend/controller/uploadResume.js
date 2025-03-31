const multer = require('multer');
const path = require('path');
const UserDataModel = require('../database/userData');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads')
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage })
const UploadResume = async (req, res) => {

    try {
        if (!req.file) {
            return res.status(401).send({ message: "File not found!" })
        }
        const user = await UserDataModel.findByIdAndUpdate({ _id: req.body.id }, { resume: `uploads/${req.file.filename}` })
        if (!user) {
            return res.status(401).send({ message: "User not found" })
        }
        return res.status(201).send({ message: "Resume uploaded successfully" })
    } catch (e) {
        return res.status(500).send({ message: "Internal server error" })
    }
}

const get_resume = async (req, res) => {
    const { id } = req.body
    try {
        const response = await UserDataModel.findById(id)
        console.log(response.resume)
        if (!response) {
            return res.status(401).send({ message: "User not found" })
        } else if (!response.resume) {
            return res.status(404).send({ message: "Resume not uploaded" })
        } else {
            return res.status(201).send({ resume: response.resume })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send({ message: "internal server error" })
    }
}
module.exports = { UploadResume, upload, get_resume }
