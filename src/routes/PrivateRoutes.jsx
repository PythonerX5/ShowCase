import React from 'react'
import { useSelector } from 'react-redux'
import '../store/authSlice'
import '../store/store'
import { Navigate } from 'react-router-dom';

function PrivateRoutes({ children }) {
    const { user } = useSelector((state) => state.auth);

    if(!user)
    {
        return <Navigate to='/login'/>
    }
    return children
}

export default PrivateRoutes
