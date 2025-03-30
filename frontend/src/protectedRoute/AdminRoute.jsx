import React, { useContext, useEffect } from 'react'
import { Context } from '../common/Context'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoute = () => {
    const { currentUser, setMessage, setPopupModal } = useContext(Context)
    useEffect(() => {
        if (!currentUser || currentUser.role !== "admin") {
          setMessage("You do not have access to this page.");
          setPopupModal(true);
        }
      }, [currentUser, setMessage, setPopupModal]);
    if ((currentUser && currentUser.role !== "admin") || !currentUser) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default AdminRoute