import axios from "axios";
import React, { useContext, useState } from "react";
import { Context } from "../common/Context";
const apiUrl = import.meta.env.VITE_API_URL
const Dashboard = () => {
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    skills: "",
    education: "",
  });
  const { setMessage, setLoading, setPopupModal } = useContext(Context)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post(`${apiUrl}/get_job_description`, job)
      if (response) {
        setMessage(response.data.message)
        setPopupModal(true)
        setJob({
          title: "",
          company: "",
          location: "",
          description: "",
          skills: "",
          education: "",
        });
      }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        setMessage(e.response.data.message)
        setPopupModal(true)
      } else {
        setMessage("Internal server error")
        setPopupModal(true)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-col  items-center w-full mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Create a Job Description</h2>

      <form onSubmit={handleSubmit} className="w-[70%] flex flex-col"><label className="block text-gray-800 font-medium">Job Title</label>
        <input
          type="text"
          name="title"
          value={job.title}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg mt-2"
          placeholder="Enter Job Title"
        />

        <label className="block text-gray-800 font-medium mt-4">Company Name</label>
        <input
          type="text"
          name="company"
          value={job.company}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg mt-2"
          placeholder="Enter Company Name"
        />

        <label className="block text-gray-800 font-medium mt-4">Location</label>
        <input
          type="text"
          name="location"
          value={job.location}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg mt-2"
          placeholder="Enter Location (e.g., Remote, New York)"
        />

        <label className="block text-gray-800 font-medium mt-4">Job Description</label>
        <textarea
          name="description"
          value={job.description}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg mt-2 h-24"
          placeholder="Write a short job description..."
        ></textarea>

        <label className="block text-gray-800 font-medium mt-4">Required Skills (comma-separated)</label>
        <input
          type="text"
          name="skills"
          value={job.skills}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg mt-2"
          placeholder="e.g., React, Node.js, Python"
        />

        <label className="block text-gray-800 font-medium mt-4">Required Education (comma-separated)</label>
        <input
          type="text"
          name="education"
          value={job.education}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg mt-2"
          placeholder="e.g., B.Tech, MCA, M.Tech"
        />
        <button type="submit" className="px-5 py-2 w-fit self-center mt-5 font-medium text-white rounded-xs transition-transform ease-in-out duration-300 hover:cursor-pointer hover:scale-105 bg-blue-500">Create</button>
      </form>
    </div>
  );
};

export default Dashboard;
