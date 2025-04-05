const mongoose = require("../database/dbConnection");
const JobDescriptionModel = require("../database/jobDescriptiondata");

const GetJobDescriptionId = async (req, res) => {
    try {
        const { userId } = req.query
        const db = mongoose.connection.db;
        const resultDataCollection = db.collection("resultData");

        const jobDescriptions = await JobDescriptionModel.find();
        if (!jobDescriptions) {
            return res.status(404).json({ message: "No job description found" })
        }
        const allResults = await Promise.all(
            jobDescriptions.map(async (job) => {
                const jobId = job._id.toString();
                const results = await resultDataCollection.find({ job_id: jobId,user_id:userId }).toArray();
                if (!results || results.length === 0) {
                    return []
                }
                return results;
            })
        );

        const flattenedResults = allResults.flat();

        res.status(200).json(flattenedResults);
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { GetJobDescriptionId };
