import axios from 'axios'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
export const Context = createContext()
const apiUrl = import.meta.env.VITE_API_URL
const ContextProvider = ({ children }) => {
    const [popupModal, setPopupModal] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [message, setMessage] = useState("")
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(false)
    const [resume, setResume] = useState(null)
    const [result, setResult] = useState(null)
    const [allResult, setAllResult] = useState([])
    const[resumeExist,setResumeExist]=useState(true)
    const location = useLocation()
    const fetchData = async () => {
        if (!token) return; // Avoid unnecessary API calls if token doesn't exist

        try {
            const response = await axios.post(`${apiUrl}/verifyToken`, { token });

            if (response.data && response.data.user) {
                setCurrentUser(response.data.user); // Set user if token is valid
            } else {
                setCurrentUser(null); // Reset user if no valid data is returned
            }
        } catch (error) {
            console.error("Error verifying token:", error.response?.data?.message || error.message);
            setCurrentUser(null); // Ensure the user state is reset on failure
        }
    };
    const fetchResume = async () => {
        if (!currentUser) {
            setResume(null)
            return
        }
        try {
            const response = await axios.post(`${apiUrl}/get_resume`, { id: currentUser.id })
            if (response.data.resume) {
                setResume(response.data.resume)
            }
        } catch (e) {
            if (e.response && e.response.status === 404) {
                setResume(null)
            }
            console.log(e)
        }
    }
    useEffect(() => {
        const resumeUrl = `${apiUrl}/${resume}`
        fetch(resumeUrl, { method: "HEAD" }).then(((res) =>
            setResumeExist(res.ok)
        )).catch(() => setResumeExist(false))
    }, [apiUrl, resume])
    useEffect(() => {
        fetchResume()
    }, [currentUser, location.pathname])
    useEffect(() => {
        fetchData()

    }, [])
    const contextValue = useMemo(() => ({
        popupModal, setPopupModal, currentUser, setCurrentUser, message,
        setMessage, setToken, loading, setLoading, fetchData, resume,
        setResume, fetchResume, setResult, result, allResult, setAllResult,resumeExist,setResumeExist
    }), [popupModal, currentUser, message, loading, resume, result, allResult,resumeExist])

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider