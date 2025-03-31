const JobDescriptionModel = require("../database/jobDescriptiondata");
const UserDataModel = require("../database/userData");

const JobDescription = async (req, res) => {
    try {
        const { title, company, location, description, skills, education, experience, age } = req.body;

        if (!title || !company || !location || !description || !age) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const createJob = await JobDescriptionModel.create({
            title,
            company,
            location,
            description,
            skills,
            education,
            experience,
            age,
        });

        return res.status(201).json({ message: "Job created successfully", job: createJob });
    } catch (error) {
        console.error("Error creating job:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const GetJobDescription = async (req, res) => {
    try {
        const response = await JobDescriptionModel.find();
        const reversedResponse = response.reverse()
        res.status(200).json(reversedResponse)
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" })
    }
};

module.exports = { JobDescription, GetJobDescription };