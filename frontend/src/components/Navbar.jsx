import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Profile from './Profile'
import axiosInstance from '../utils/axiosInstance'
import { useDispatch } from 'react-redux'
import { signOutSuccess } from '../redux/slice/userSlice'

const Navbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onLogout = async () => {
        try {
            const responce = await axiosInstance.post("/user/signout");
            if(responce.data) {
                dispatch(signOutSuccess())
                navigate("/login");
            }
        } 
        catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='bg-white flex items-center justify-between px-10 py-2
                drop-shadow sticky top-0 z-10'>
            <Link to={"/"}>
                <h1 className='font-bold text-2xl sm:text-2xl flex flex-wrap'>
                    <span className='text-blue-400'>Travel</span>
                    <span className='text-blue-800'>Dairy</span>
                </h1>
            </Link>

            <Profile onLogout={onLogout}/>
        </div>
    )
}

export default Navbar
