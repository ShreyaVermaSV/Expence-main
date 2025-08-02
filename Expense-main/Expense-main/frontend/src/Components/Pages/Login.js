import React from 'react'
import axios from 'axios';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
export default function Login(props) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/login', {
      email: email,
      password: password
    }).then((res) => {
      Cookies.set('token', res.data.loginUser.token, { expires: 7 });
      
      // console.log('Logged In Successfully', res.data.loginUser.token);
      navigate('/dashboard');

    }).catch((err) => {
      console.error('Error while logging in');
    })



  }


  return (
    <div  className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
    <div id='modal-login' className='h-screen  overflow-auto w-screen flex justify-center items-center text-black'>
      <div className='grid grid-cols-1 h-fit w-1/3 p-5 rounded-[12px] bg-primary ring-1 ring-gray-700 max-sm:w-5/6 max-lg:w-1/2'>
      <div className='flex justify-end'>
            <button onClick={() => props.setShowLogin(false)} >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>

            </button>
          </div>
        <h1 className='flex text-2xl pb-2 mb-3 border border-l-0 border-r-0 border-t-0 border-gray-700 justify-center'>Login</h1>
        <form className='grid h-1/2 grid-cols-1' onSubmit={handleSubmit}>
          <label title='Email'>Email</label>
          <input
            className='my-5 bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-inherit focus:outline-none'
            type='email'
            placeholder='Enter your email' required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label title='Password'>Password</label>
          <input
            className='my-5 bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-inherit focus:outline-none'
            type={showPassword?'text':'password'}
            placeholder='*******'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
          <div className='flex'>
            <input type='checkbox' onChange={() => setShowPassword(!showPassword)} className='flex justify-start items-start mb-4' />
            <label className='mb-4 ml-3'>Show Password</label>

          </div>
          <button className='ring-1 mb-9 ring-gray-200 rounded-[20px] p-2 hover:bg-secondary hover:text-white'>Login</button>
          <h1 className='flex justify-center'>
            Don't have an account?
          </h1>
          <button onClick={() => {props.setShowLogin(false); props.setShowSignup(true)}} className='text-blue-400'>Register</button>
        </form>

      </div>
    </div>
    </div>
  )
}


