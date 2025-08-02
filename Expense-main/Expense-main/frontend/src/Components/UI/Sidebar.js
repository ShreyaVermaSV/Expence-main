import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteCookie } from '../Utils/deleteCookie';
import { MyContext } from '../Utils/MyContext';
import logoDark from '../../screenshots/logo-dark.png';
import axios from 'axios';
import { getCookie } from '../Utils/getCookie';
import { jwtDecode } from 'jwt-decode';
import Loading from './Loading';

export default function Sidebar() {
  const navigate = useNavigate();
  const [isHamburgerPressed, setHamburgerPressed] = useState(false);
  const { userData, setUserData } = useContext(MyContext);
  
  const [id, setId] = useState();

  const getUserData = useCallback(() => {
    if (id) {
      axios.get('http://localhost:5000/user', {
        params: { id: id }
      }).then((response) => {
        setUserData({ key: response.data });
      });
    }
  }, [id, setUserData]);

  useEffect(() => {
    const verifyToken = () => {
      const token = getCookie('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken.id);
        setId(decodedToken.id);
      }
    };
    verifyToken();
    getUserData();
  }, [getUserData]);
  
  const navigateToSpending = () => {
    navigate('/spending');
  }

  const navigateToDashboard = () => {
    navigate('/dashboard');
  }

  const navigateToCategories = () => {
    navigate('/categories');
  }

  const navigateToBudget = () => {
    
    navigate('/budget');
  }
  const navigateToUser = () => {
    navigate('/User');
  }

  
  const handlelogout = () => {
    console.log('logout clicked');
    deleteCookie('token');
    setUserData({ key: null });
    navigate('/');
  }

  console.log(userData.key)

  return (
    <>
      {userData&&userData.key?

        <>
            {/* Sidebar     */}
      <div className={`fixed animate-fadeinleft w-72 z-50  bg-black h-dvh max-lg:${!isHamburgerPressed ? 'hidden' : 'visible'} `}>
        <div className='lg:hidden'>
          {
            isHamburgerPressed ? <button className='pl-2 pr-2 mt-4 text-white' onClick={() => setHamburgerPressed(!isHamburgerPressed)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
            </button>
              : <></>
          }
        </div>
        <div className='flex justify-center items-center h-36 text-white'>
          <img src={logoDark} alt='logo-img'/>
        </div>
        <div className='px-10 text-lg font-normal text-white text-start'>
          <h1 className='text-gray-500 px-3'>MENU</h1>
          <div className='flex py-3 px-2 hover:bg-secondary rounded-[20px]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <button className='px-2 ' onClick={navigateToDashboard}>Dashboard</button>
          </div>
          <div className='flex py-3 px-2 hover:bg-secondary rounded-[20px]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
            <button className='px-2' onClick={navigateToSpending}>Spending</button>
          </div>
          <div className='flex py-3 px-2 hover:bg-secondary rounded-[20px]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
            </svg>

            <button className='px-2' onClick={navigateToBudget}>Budget</button>
          </div>
          <div className='flex py-3 px-2 hover:bg-secondary rounded-[20px]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            <button className='px-2' onClick={navigateToCategories}>Categories</button>
          </div>
          <div className='flex py-3 px-2 hover:bg-secondary rounded-[20px]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>

            <button className='px-2' onClick={navigateToUser}>User</button>
          </div>
          <div className='flex py-3 px-2 hover:bg-secondary rounded-[20px]'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
            <button onClick={handlelogout} className='px-2'>Logout</button>
          </div>

        </div>
      </div>
      {/* Navbar */}

      <div className='fixed bg-primary h-20 w-screen top-0 left-72 -z-20  max-lg:left-0'>
        <div className='flex items-center p-3 text-white '>
          <div className='invisible text-black max-lg:visible max-lg:flex max-lg:items-center'>
            <button onClick={() => setHamburgerPressed(!isHamburgerPressed)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
              </svg>
            </button>
          </div>
          <h1 className='text-xl font-semibold text-ternary flex justify-center items-center mx-3'>Welcome, &nbsp;
          {userData.key.username}
          </h1>
        </div>
      </div>

        </>:<Loading/>      
      
      }
      
    </>


  )
}
