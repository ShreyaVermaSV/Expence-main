import React, { useEffect, useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import img1 from '../../screenshots/img1.png';
import img2 from '../../screenshots/img2.png';
import img3 from '../../screenshots/img3.png';
import img4 from '../../screenshots/img4.png';
import img5 from '../../screenshots/img5.png';
import logo from '../../screenshots/logo.png';
import { useNavigate } from 'react-router-dom';
import l1 from '../../screenshots/L1.jpg';

export default function Landing() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [hamburger, setHamburger] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [preClick, setPreClick] = useState(false);
    const [nextClick, setNextClick] = useState(false);

    const imageMap = [img1, img2, img3, img4, img5];

    const prevButton = (e) => {
        setPreClick(true)
        setCurrentImage((currentImage - 1 + imageMap.length) % imageMap.length);
        setNextClick(false);
    }

    const nextButton = (e) => {
        setNextClick(true);
        setCurrentImage((currentImage + 1) % imageMap.length);
        setPreClick(false);
    }

    const navigate = useNavigate();
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (showLogin && event.target.id === 'modal-login') {
                setShowLogin(false);
            }
            if (showSignup && event.target.id === 'modal-signup') {
                setShowSignup(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [showLogin, showSignup]);

    return (
        <>
            <div className='text-black h-fit overflow-hidden'>
                <nav className='flex justify-between items-center px-4 py-4 bg-primary w-screen'>
                    <div>
                        <img src={logo} onClick={() => navigate('/')} className="w-56 " alt='logo' />
                    </div>
                    <div className='flex items-center  max-sm:hidden'>
                        <h1 className='m-2'>Home</h1>
                        <h1 className='m-2'>About</h1>
                        <h1 className='m-2'>Contact</h1>
                        <button className='m-2 px-4 py-2 ring-1 ring-gray-300 rounded-[20px] hover:bg-secondary hover:text-white' onClick={() => setShowLogin(!showLogin)}>Login</button>
                        <button className='m-2 px-4 py-2 ring-1 ring-gray-300 rounded-[20px] hover:bg-secondary hover:text-white' onClick={() => setShowSignup(!showSignup)}>Signup</button>

                    </div>
                    <div className='hidden max-sm:flex justify-end p-2 items-center'>
                        {!hamburger ? <button onClick={() => setHamburger(!hamburger)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button> :
                            <button onClick={() => setHamburger(!hamburger)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>

                            </button>

                        }
                    </div>
                </nav>
                {
                    hamburger ? <div className={`animate-fade-in-bouncedown bg-primary border border-l-0 border-r-0 z-50 border-t-0 w-screen h-36 max-sm:'block' sm:hidden `}>
                        <div className='grid grid-cols-3 items-center'>
                            <h1 className='m-3 flex justify-center px-2 py-2'>Home</h1>
                            <h1 className='m-3 flex justify-center px-2 py-2'>About</h1>
                            <h1 className='m-3 flex justify-center px-2 py-2'>Contact</h1>
                        </div>
                        <div className='grid grid-cols-2'>
                            <button className='m-3 px-4 py-2 ring-1 ring-gray-300 rounded-[20px] hover:bg-secondary hover:text-white' onClick={() => setShowLogin(!showLogin)}>Login</button>
                            <button className='m-3 px-4 py-2 ring-1 ring-gray-300 rounded-[20px] hover:bg-secondary hover:text-white' onClick={() => setShowSignup(!showSignup)}>Signup</button>
                        </div>
                    </div> : <></>
                }
                {showLogin && <Login setShowSignup={setShowSignup} setShowLogin={setShowLogin} />}
                {showSignup && <Signup setShowLogin={setShowLogin} setShowSignup={setShowSignup} />}
            </div>
            <div className="relative w-full h-fit flex items-center justify-center">
                <img className="opacity-10 m-10 mb-0 w-fit object-cover" src={l1} alt="img" />
                <div className="absolute inset-0 flex justify-center text-7xl">
                    <div className="m-10 flex justify-start">
                        <div className="grid m-14 h-fit grid-cols-1 max-lg:text-5xl max-sm:text-3xl max-sm:m-1">
                            <div className="flex justify-center items-center">Your finance management made easier with Expense.</div>
                            <div className="m-10 flex justify-center max-sm:m-1">
                                <button className='w-fit h-fit m-3 px-5 py-3 max-sm:p-3 max-sm:text-sm text-xl font-light ring-1 ring-gray-300 rounded-[20px] bg-secondary text-white' onClick={() => setShowSignup(!showSignup)}>Get Started</button>
                                <button className='w-fit h-fit m-3 px-5 py-3 max-sm:p-3 max-sm:text-sm text-xl font-light ring-1 ring-gray-300 rounded-[20px] bg-primary'>Learn More</button>
                            </div>
                            <div className="flex justify-center text-4xl m-10 items-center max-sm:text-2xl">
                                <p>Take a Look</p>
                            </div>
                            <div className="flex ring-1 rounded-[20px] ring-gray-300">
                                <div className="w-full h-full">
                                    <img className={`rounded-[20px]`} src={imageMap[currentImage]} alt='img' />
                                </div>
                            </div>
                            <div className="flex justify-between  p-5">
                                <button onClick={prevButton}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                                </button>
                                <div><p className="text-4xl max-sm:text-xl">{currentImage+1}/{imageMap.length}</p></div>
                                <button onClick={nextButton}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='max-sm:m-20'></div>
            <div className="flex h-24 text-base p-4 bg-primary ring-1 ring-gray-300">
                <footer className='flex mb-0 justify-end'>
                    © Expense 2024
                </footer>
            </div> */}
        </>
    );
}
