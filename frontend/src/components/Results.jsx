import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { Context } from '../common/Context'

const apiUrl = import.meta.env.VITE_API_URL

const Results = () => {
  const { currentUser, setAllResult, allResult, result, setResult, setLoading } = useContext(Context)

  const fetchResult = async () => {
    if (!currentUser?.id) return
    try {
      setLoading(true)
      const response = await axios.get(`${apiUrl}/job_description_id?userId=${currentUser.id}`)
      setAllResult(response.data)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResult()
  }, [currentUser])

  const missingSkills = result?.required_skills?.filter(
    skill => !result.matched_skills.includes(skill)
  ) || []

  const previousResults = allResult?.filter(res => res._id !== result?._id) || []

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">

      {/* Recent Result */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <div className='flex justify-between items-center flex-wrap mb-4'>
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">Recent Screening Result</h2>
          {result && <p className='text-green-400 font-semibold'>{result.submission_time}</p>}
        </div>
        {!result || !result.job_title ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recent Result Found</h3>
            <p className="text-gray-500">Please upload a resume or select a job to see results.</p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Job Info */}
            <div>
              <p className="text-gray-800 text-2xl"><strong>Job Title:</strong> {result.job_title}</p>
              <p className="text-gray-700 mt-2"><strong>Description:</strong> {result.job_description}</p>
            </div>

            {/* Matching Summary */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Matching Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <p><strong>Match Score:</strong> {result.match_score}%</p>
                <p><strong>Total Resume Score:</strong> {result.total_resume_score}/100</p>
                <p><strong>Education Score:</strong> {result.education_score}/100</p>
                <p><strong>Experience Score:</strong> {result.experience_score}/100 ({result.experience_years} Years)</p>
                <p><strong>Project Score:</strong> {result.project_score}/100</p>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Skill Match</h3>
              <div className="mb-4">
                <h4 className="text-lg font-medium text-green-700 mb-1">Matched Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {result.matched_skills.map((skill, i) => (
                    <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-red-700 mb-1">Missing Skills</h4>
                {missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill, i) => (
                      <span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-600 font-semibold">No missing skills 🎉</p>
                )}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Education History</h3>
              <ul className="list-disc list-inside text-gray-700">
                {result.education.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <h3 className="text-xl font-semibold mb-2 text-yellow-800">Suggestions for Improvement</h3>
              <ul className="list-disc list-inside text-gray-800">
                {missingSkills.map((skill, idx) => (
                  <li key={idx}>Add <strong>{skill}</strong> to improve your skill match.</li>
                ))}
                <li>Include internships or freelance work to boost experience score.</li>
                <li>Elaborate on project details to align better with job expectations.</li>
              </ul>
            </div>

          </div>
        )}
      </div>

      {/* Previous Results */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">📂 Previous Results</h2>

        {previousResults.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-gray-700">No Previous Results Found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {previousResults.map(item => (
              console.log(item),
              <div
                key={item._id}
                className="bg-gray-50 relative shadow rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div>
                  <h4 className="text-2xl font-semibold text-gray-800">{item.job_title}</h4>
                  <p className="text-sm text-gray-600">Match Score: {item.match_score}%</p>
                  <p className="text-sm text-gray-600">Resume Score: {item.total_resume_score}/100</p>
                </div>
                <button
                  onClick={() => {
                    setResult(item)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="mt-3 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  View Details
                </button>
                <p className= 'text-sm text-green-400 font-semibold absolute bottom-[-5px] right-3'>{item.submission_time}</p>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Results
