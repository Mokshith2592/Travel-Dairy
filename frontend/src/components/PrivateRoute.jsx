import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

const PrivateRoute = () => {
    const {currentUser} = useSelector((state) => state.user)
    if(currentUser) return <Outlet />
    return <Navigate to={"/login"} />
}

export default PrivateRoute
