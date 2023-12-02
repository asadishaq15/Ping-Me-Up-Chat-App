import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import RegisterPage from './pages/registerPage';
import './style.scss';
import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';
import { useContext } from 'react';
import { AuthContext } from './context/authContext';

function App() {

  const {currentUser}= useContext(AuthContext)

  const ProtectedRoute =({children})=>{
    if (!currentUser)
    {
      return <Navigate to="/login"/>
    }
    return children
  }
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
  