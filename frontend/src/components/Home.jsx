import React, { useContext, useEffect, useState } from "react";
import Loading from "../common/Loading"; // Import Loading component
import axios from "axios";
import { Context } from "../common/Context";

const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
  const [selectFile, setSelectFile] = useState(null);
  const [loading, setLoadingContainer] = useState(false);
  const { currentUser, resume, fetchResume, setLoading, setMessage, setPopupModal, resumeExist } = useContext(Context)
  console.log(resume)


  const handleFilename = (e) => {
    const file = e.target.files[0];
    setSelectFile(file);
  };
  const uploadResume = async () => {
    if (!currentUser) {
      setMessage("Sign in to unlock features!")
      setPopupModal(true)
      return
    }
    if (!selectFile) {
      alert("Please select a file to upload!");
      return;
    }
    setLoading(true)
    const formData = new FormData();
    formData.append("resume", selectFile)
    formData.append("id", currentUser.id)

    setLoadingContainer(true)
    try {
      const response = await axios.put(`${apiUrl}/uploadResume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response)
    } catch (error) {
      console.error("Error uploading resume:", error);
    } finally {
      setLoading(false)
      fetchResume()
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-center px-6">
      <h1 className="md:text-5xl mt-[20vh] text-3xl text-gray-800 font-semibold">
        AI-Powered Resume Screener
      </h1>
      <p className="mt-4 md:text-lg text-gray-600 max-w-2xl">
        Effortless hiring with AI! Upload resumes and let AI analyze, filter, and find the best candidates in seconds.
      </p>
      <div className="border mt-6 md:mt-3 flex items-center px-3 py-2 bg-white rounded-lg shadow-sm">
        <label className="cursor-pointer flex items-center space-x-2">
          <span className="text-blue-600 font-medium">
            {selectFile ? selectFile.name : "Upload Resume"}
          </span>
          <input type="file" className="hidden" onChange={handleFilename} />
        </label>
        <button
          onClick={uploadResume}
          className={`ml-4 px-3 py-1 text-white rounded-md transition ${selectFile ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          disabled={!selectFile}
        >
          Upload
        </button>
      </div>
      <div className="pdf-container mt-10 w-[90%] md:w-3/5 h-[50vh] md:h-[70vh] mb-20">
        {loading && <Loading />}
        <h2 className="text-2xl mb-5">Your Uploaded Resume..</h2>
        {resume ? (
          resumeExist ? (<iframe
            src={`${apiUrl}/${resume}`}
            className="responsive-iframe flex justify-center items-center"
            width="100%"
            height="100%"
            onLoad={() => setLoadingContainer(false)}
          ></iframe>) : (<p>Resume is stored on the device you uploaded from.
            To work with it on this device, please upload your resume again </p>)
        ) : (<p>No resume Uploaded</p>)}
      </div>
    </div>
  );
};

export default Home;
