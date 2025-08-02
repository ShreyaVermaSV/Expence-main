import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

export default function Signup(props) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      alert('Password does not match!');
      return;
    }

    axios.post('http://localhost:5000/signup', {
      name: name,
      username: username,
      email: email,
      password: password
    }).then((response) => {
      console.log("Signup successful", response);
      navigate('/login')

    }).catch((error) => {
      console.error("Signup error", error);
    });

  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
      <div id='modal-signup' className='flex justify-center h-screen w-screen overflow-auto items-center text-black '>
        <div className='grid grid-cols-1 h-fit w-1/3 rounded-[12px] p-5 bg-primary ring-1 ring-gray-700 max-sm:w-5/6 max-lg:w-1/2'>
          <div className='flex justify-end'>
            <button onClick={() => props.setShowSignup(false)} >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>

            </button>
          </div>
          <h1 className='flex justify-center text-2xl items-center border border-l-0 border-r-0 border-t-0 pb-3 mb-2 border-gray-700'>Signup</h1>
          <form className='grid h-1/2 grid-cols-1' onSubmit={handleSubmit}>
            <label className='mb-2' title='name'>Name</label>
            <input
              className='mb-5 bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-inherit focus:outline-none'
              type='text'
              placeholder='Enter the name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label className='mb-2' title='username'>Username</label>
            <input
              className='mb-5 bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-inherit focus:outline-none'
              type='text'
              placeholder='Enter the username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label className='mb-2' title='Email'>Email</label>
            <input
              className='mb-5 bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-inherit focus:outline-none'
              type='email'
              placeholder='Enter the email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className='mb-2' title='password'>Password</label>
            <input
              className='mb-5 bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-inherit focus:outline-none'
              type='password'
              placeholder='Enter the password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className='mb-2' title='confirm password'>Confirm Password</label>
            <input
              className='mb-5 bg-gray-50 border border-gray-300 text-sm rounded-lg text-black focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-inherit focus:outline-none'
              type='password'
              placeholder='Enter confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type='submit'
              className='ring-1 mb-9 ring-gray-200 rounded-[20px] p-2 hover:bg-secondary hover:text-white'
            >Signup</button>
            <h1 className='flex justify-center'>
              Already have an account?
            </h1>
            <button onClick={() => {props.setShowLogin(true); props.setShowSignup(false)}} className='text-blue-400'>Login</button>

          </form>
        </div>
      </div>
    </div>
  )
}
