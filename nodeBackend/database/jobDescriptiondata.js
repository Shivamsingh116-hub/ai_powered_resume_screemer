const mongoose = require('mongoose')
const JobDescriptionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,

    },
    description: {
        type: String,
    },
    skills: {
        type: String,
    },
    education: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})
const JobDescriptionModel = mongoose.model('JobDescriptionData', JobDescriptionSchema)
module.exports = JobDescriptionModel