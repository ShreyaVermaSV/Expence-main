import React from 'react'
import { Navigate } from 'react-router-dom'
import { getCookie } from './getCookie';

// function getCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//   }

const ProtectedRoute = ( { children}) => {

    const token = getCookie('token');
    return token ? children : <Navigate to='/' />
}


export default ProtectedRoute;