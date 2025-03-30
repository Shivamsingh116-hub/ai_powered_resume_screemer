import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
const Modal=({message,onClose,duration})=>{
    useEffect(()=>{
        const timer = setTimeout(() => {
            onClose()
        }, duration || 3000)

        return () => clearTimeout(timer)
    }, [onClose, duration])
    return ReactDOM.createPortal(
            <div className="bottom-5 right-5 fixed bg-blue-500 px-3 py-2 text-white animate-bounce">
                {message}
            </div>,
        document.getElementById('portal-root')
    )
}

export default Modal