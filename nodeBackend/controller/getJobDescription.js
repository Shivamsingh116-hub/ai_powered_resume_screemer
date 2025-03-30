const JobDescriptionModel = require("../database/jobDescriptiondata");

const JobDescription = async (req, res) => {
    try {
        const { title, company, location, description, skills, education } = req.body;

        if (!title || !company || !location || !description) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const createJob = await JobDescriptionModel.create({
            title,
            company,
            location,
            description,
            skills,
            education,
        });

        return res.status(201).json({ message: "Job created successfully", job: createJob });
    } catch (error) {
        console.error("Error creating job:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { JobDescription };
