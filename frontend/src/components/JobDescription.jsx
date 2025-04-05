import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../common/Context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;
const pythonUrl = import.meta.env.VITE_PYTHON_API_URL;

const JobDescription = () => {
  const { setLoading, currentUser, resume, setMessage, setPopupModal, setResult } = useContext(Context);
  const [JobDescriptionData, setJobDescriptionData] = useState([]);
  const [loading, setLocalLoading] = useState(false);
  const navigate = useNavigate()
  const fetchJob = async () => {
    setLoading(true);
    setLocalLoading(true);

    try {
      const response = await axios.get(`${apiUrl}/job_description`);
      if (response) {
        setJobDescriptionData(response.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, []);
  const handleResult = async (job) => {
    const jobData = JSON.stringify(job)
    if (!currentUser) {
      setMessage("Sign in to unlock features!")
      setPopupModal(true)
      return
    } else if (!resume) {
      setMessage("Upload resume to unlock features!")
      setPopupModal(true)
      return
    } else {
      setLoading(true
      )
      try {
        const response = await axios.get(`${pythonUrl}/resume_analysis?job=${jobData}&resume=${resume}&userId=${currentUser.id}`)
        if (response) {
          setMessage(response.data.message)
          setPopupModal(true)
          setResult(response.data.data)
          navigate("/results")
        }
      } catch (e) {
        if (e.response && e.response.status === 400) {
          setMessage(e.response.data.message)
          setPopupModal(true)
        } else if (e.response && e.response.status === 400) {
          setMessage(e.response.data.message)
          setPopupModal(true)
        } else {
          setMessage("Internal server error!")
          setPopupModal(true)
        }
      } finally {
        setLoading(false)
      }
    }
  }
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
        Find the Best Jobs & Check Your Resume Ranking!
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Select a job to compare your resume and see how well you match.
      </p>

      {loading ? (
        <div className="text-center text-gray-500">Loading jobs...</div>
      ) : JobDescriptionData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-medium text-gray-600">No Job Listings Available</h3>
          <p className="text-gray-500 mt-2">Check back later for new job opportunities!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {JobDescriptionData.map((job) => (
            <div key={job._id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
              <p className="text-gray-600">{job.company} - {job.location}</p>
              <p className="mt-2 text-sm text-gray-700">{job.description}</p>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-800">Required Skills:</h4>
                <p className="text-gray-600">{job.skills.split(',').map(skill => `• ${skill}`).join(' ')}</p>
              </div>

              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-800">Education:</h4>
                <p className="text-gray-600">{job.education}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">Experience: {job.experience} years</span>
                <button onClick={() => handleResult(job)} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-transform transform hover:scale-105">
                  Check Resume Rank
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobDescription;
