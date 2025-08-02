import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './Components/Pages/Landing';
import Dashboard from './Components/Pages/Dashboard';
import ProtectedRoute from './Components/Utils/ProtectedRoute';
import Spending from './Components/Pages/Spending';
import './App.css';
import Categories from './Components/Pages/Categories';
import Budget from './Components/Pages/Budget'
import User from './Components/Pages/User'
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { MyContext } from './Components/Utils/MyContext';
import { getCookie } from './Components/Utils/getCookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';


function App() {
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
      // console.log('this is token', token);
      if (token) {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken.id);
        setId(decodedToken.id);
      }
    };
    verifyToken();
    getUserData();
  }, [getUserData]);

  console.log(userData);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route exact path='/categories' element={<ProtectedRoute>
            <Categories />
          </ProtectedRoute>
          } />
          <Route exact path='/budget' element={<ProtectedRoute>
            <Budget />
          </ProtectedRoute>
          } />
          <Route exact path='/user' element={<ProtectedRoute>
            <User />
          </ProtectedRoute>
          } />
          <Route exact path='/spending' element={<ProtectedRoute><Spending /></ProtectedRoute>} />
          <Route exact path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
