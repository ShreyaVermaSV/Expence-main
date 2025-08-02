import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../UI/Sidebar'
import { MyContext } from '../Utils/MyContext';
import dummyProfile from '../../screenshots/dummyProfile.png'
import axios from 'axios';
import { useRef } from 'react';


export default function User() {
  const { userData, setUserData } = useContext(MyContext);
  const [editUserName, setEditUserName] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const preserveUserData = useRef(userData);

  useEffect(() => {
    preserveUserData.current = userData;
  }, [userData]);

  const handlePatchRequest = async (field1, id, field2, value, setEditField) => {
    try {
      setEditField(false); // Set the edit state to false
      console.log(value);
      const response = await axios.patch('http://localhost:5000/user', { [field1]: id, [field2]: value });
      console.log(response);
      setUserData(prev => ({ ...prev, key: { ...prev.key, [field2]: value } })); // Update userData state
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
    }
  };

  // Handlers for each field
  const handleNameChange = () => {
    handlePatchRequest('userId', userData.key.id, 'name', newName, setEditName);
    setNewName('');
  };

  const handleUserNameChange = () => {
    handlePatchRequest('userId', userData.key.id, 'username', newUserName, setEditUserName);
    setNewUserName('');
  };

  const handleEmailChange = () => {
    handlePatchRequest('userId', userData.key.id, 'email', newEmail, setEditEmail);
    setNewEmail('');
  };

  const handleChangePassword = async () => {
    if(confirmPassword !== newPassword){
      alert('Passwords do not match');
    }
   
    try {
      setShowChangePasswordModal(false); // Set the edit state to false
      await axios.patch('http://localhost:5000/user', { 
          id: userData.key.id,
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword 
      });
      console.log('Password changed');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.log('error updating password')
    }
  }

  console.log("user",userData.key);
  return (
    <>
      <Sidebar />
      <div className='absolute left-72 top-16 overflow-auto m-9 right-0 bottom-0 max-lg:left-0 max-lg:ml-4 max-lg:mr-4'>
        <div className="flex justify-center  my-4 font-semibold text-2xl text-black">Profile</div>
        <div className="p-4 w-full h-fit bg-primary max-lg:h-fit  max-lg:m-2">
          <div className='grid grid-cols-1'>
            <div className='flex justify-center items-center gap-4'>
              <img src={dummyProfile} alt='profile' className='w-36 h-36 rounded-full' />
            </div>
            <div className='flex justify-center mt-5 font-bold'>
                {userData.key.name}
              </div>
          </div>
          <div className=' flex m-5 py-2 border border-t-0 border-l-0 border-r-0 border-gray-300 justify-start'>
            <div className='font-bold'>Name:&nbsp; </div>
            <div className='flex  w-full justify-between'>
              {
                !editName ? <div>{userData.key.name}</div> :
                  <div className='flex'>
                    <input 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className='ring-1 ring-gray-300 rounded-[12px] p-1' placeholder='Enter new name' />
                    <button 
                    onClick={handleNameChange}
                    className='bg-primary mx-2 ring-1 ring-gray-300  text-black rounded-[12px] p-1'>Save</button>
                  </div>
              }
              <div onClick={() => setEditName(!editName)}>
                {
                  editName ? <button className='bg-primary mx-2 ring-1 ring-gray-300  text-black rounded-[12px] p-1'>Cancel</button> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                }
              </div>
            </div>
          </div>
          <div className='flex m-5 py-2 border border-t-0 border-l-0 border-r-0 border-gray-300 justify-start items-center'>
            <div className='font-bold'>Username:&nbsp;</div>
            <div className='flex  w-full justify-between'>
              {
                !editUserName ? <div>{userData.key.username}</div> :
                  <div className='flex'>
                    <input value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className='ring-1 ring-gray-300 rounded-[12px] p-1' placeholder='Enter new username' />
                    <button 
                    onClick={handleUserNameChange}
                    className='bg-primary mx-2 ring-1 ring-gray-300  text-black rounded-[12px] p-1'>Save</button>
                  </div>
              }
              <div onClick={() => setEditUserName(!editUserName)}>
                {
                  editUserName ? <button className='bg-primary mx-2 ring-1 ring-gray-300  text-black rounded-[12px] p-1'>Cancel</button> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                }
              </div>
            </div>
          </div>
          <div className=' flex m-5 py-2 border border-t-0 border-l-0 border-r-0 border-gray-300 justify-start'>
            <div className='font-bold'>Email:&nbsp;</div>
            <div className='flex  w-full justify-between'>
              {
                !editEmail ? <div>{userData.key.email}</div> :
                  <div className='flex'>
                    <input 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className='ring-1 ring-gray-300 rounded-[12px] p-1' placeholder='Enter new name' />
                    <button 
                    onClick={handleEmailChange}
                    className='bg-primary mx-2 ring-1 ring-gray-300  text-black rounded-[12px] p-1'>Save</button>
                  </div>
              }
              <button onClick={() => setEditEmail(!editEmail)}>
                {
                  editEmail ? <button className='bg-primary mx-2 ring-1 ring-gray-300  text-black rounded-[12px] p-1'>Cancel</button> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                }
              </button>
            </div>
          </div>
          <div className=' flex m-5 py-2 border border-t-0 border-l-0 border-r-0 border-gray-300 justify-start'>
            <div className='font-bold'>Password:&nbsp;</div>
            <button onClick={() => setShowChangePasswordModal(!showChangePasswordModal)} className='font-normal text-blue-500'>Change Password</button>
          </div>
          {showChangePasswordModal && (
                  <div id="modal-backdrop" className="fixed inset-0 z-50 rounded flex items-center justify-center bg-black bg-opacity-70">

                    <div className="bg-primary rounded-[12px] p-8 max-w-md w-full">
                      <div className='flex justify-end text-black'>
                        <button 
                        onClick={() => setShowChangePasswordModal(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>

                        </button>
                      </div>
                      <h2 className="flex justify-center font-bold p-2 text-black my-5 border-b-2 border-gray-500">Change Password</h2>
                      <div className='mb-2'>
                        <div className="my-1 text-black">Enter Old Password</div>
                        <input placeholder='*******' 
                        value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} 
                        className="text-black ring-1 ring-gray-300 p-2 bg-inherit  rounded w-full focus:outline-none " type="password" />
                        <div className="my-1 text-black">Enter new Password</div>
                        <input placeholder='*******' 
                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
                        className="text-black ring-1 ring-gray-300 p-2 bg-inherit  rounded w-full focus:outline-none " type="password" />
                        <div className="my-1 text-black">Confirm new Password</div>
                        <input placeholder='*******' 
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                        className="text-black ring-1 ring-gray-300 p-2 bg-inherit  rounded w-full focus:outline-none " type="password" />
                      </div>
                      
                        
                        <div className='flex justify-center'>
                          <button 
                          onClick={handleChangePassword} 
                          className='py-2 px-4 outline-none  text-black w-full hover:bg-secondary rounded-[20px] hover:text-white'>Submit</button>
                        </div>
                    </div>
                  </div>
                )}
        </div>
      </div>
    </>
  )
}
