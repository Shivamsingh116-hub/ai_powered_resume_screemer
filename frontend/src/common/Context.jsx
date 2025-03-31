import axios from 'axios'
import React, { createContext, useEffect, useMemo, useState } from 'react'
export const Context = createContext()
const apiUrl = import.meta.env.VITE_API_URL
const ContextProvider = ({ children }) => {
    const [popupModal, setPopupModal] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [message, setMessage] = useState("")
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(false)
    const [resume, setResume] = useState(null)
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
            return
        }
        try {
            const response = await axios.post(`${apiUrl}/get_resume`, { id: currentUser.id })
            if(response.data.resume){
                setResume(response.data.resume)          
            }
        } catch (e) {
            if(e.response && e.response.status ===404){
                setResume(null)
            }
            console.log(e)
        }
    }
    useEffect(() => {
        fetchResume()
    }, [currentUser])
    useEffect(() => {
        fetchData()

    }, [])
    const contextValue = useMemo(() => ({
        popupModal, setPopupModal, currentUser, setCurrentUser, message,
        setMessage, setToken, loading, setLoading, fetchData,resume,
        setResume,fetchResume
    }), [popupModal, currentUser, message, loading,resume])

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider