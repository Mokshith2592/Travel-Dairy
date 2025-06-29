import React, { useState } from 'react'
import PasswordInput from '../../components/PasswordInput'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import validateEmail from '../../utils/helper'
import {useDispatch, useSelector} from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../../redux/slice/userSlice';

const Login = () => {
    const [email ,setEmail] = useState("");
    const [password ,setPassword] = useState("");
    const [error ,setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {loading} = useSelector((state) => state.user)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validateEmail(email)) {
            setError("Please enter a valid email address.")
            return
        }

        if(!password) {
            setError("Please enter your password.")
            return 
        }

        setError(null);

        //Login API Call
        try {
            dispatch(signInStart());
            const response = await axiosInstance.post('/auth/signin' ,{
                email,
                password,
            })

            if(response.data) {
                dispatch(signInSuccess(response.data))
                navigate('/');
            }
            else dispatch(signInFailure("An unexpected error occured!"))
        }
        catch (err) {
            dispatch(signInFailure("An unexpected error occured!"))
            if(err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            }
            else {
                setError("Something went wrong. Please try again.")
            }
        }
    }


    return (
        <div className='h-screen bg-cyan-50 overflow-hidden relative'>
            <div className='login-ui-box right-[1px] -top-22'></div>
            <div className='container h-screen flex items-center justify-center px-20 mx-auto'>
                <div className="w-2/4 h-[90vh] flex items-end bg-[url('https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg')] bg-cover bg-center rounded-lg p-10 z-50">
                    <div className='text-white'>
                        <h4 className='text-5xl text-white font-semibold leading-[58px]'>Create Your <br />Travel Stories</h4>
                        <p className='text-[15px] text-white leading-6 pr-7 mt-4'>
                            Record your travel experiences and memories in your travel journey
                        </p>
                    </div>
                </div>
                <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
                    <form onSubmit={handleSubmit}>
                        <h4 className='text-3xl font-semibold mb-7'>Login</h4>
                        <input type="email" placeholder='Email' className='input-box' value={email} onChange={(e) => setEmail(e.target.value)}/>

                        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)}/>

                        {error && <p className="text-red-500 text-xs pb-1 ml-3">{error}</p>}

                        {loading ? (
                            <p className='animate-pulse w-full text-center btn-primary'>LOADING...</p>
                        ) : 
                        (<button type='submit' className='btn-primary'>LOGIN</button>)
                        }
                        <p className='text-xs text-slate-500 text-center my-4'>Or</p>
                        <button type='submit' className='btn-primary btn-light' onClick={() => navigate('/sign-up')}>CREATE ACCOUNT</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
