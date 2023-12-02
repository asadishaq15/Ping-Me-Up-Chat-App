import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RegisterPage from './registerPage'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'
const LoginPage = () => {
  const [err,setError]=useState(false)
   const navigate = useNavigate();
  const handleSubmit= async (e)=>{
      e.preventDefault();
     
      const email = e.target[0].value;
      const password = e.target[1].value;
     

    try {
      await signInWithEmailAndPassword( auth,email,password)
      navigate('/')
      
              } 
              catch(err){
              setError(true)
              }
            }
  return (
    <div className='formContainer'> 
      <div className='formWrapper'>
        <span className='logo'>PingMeUp </span>
        <span className='title'>Login</span>
        <form onSubmit={handleSubmit}>
            
            <input type='email' placeholder='email'></input>
            <input type='password' placeholder='password'></input>
            
            <button>Sign in</button>
        </form>
        <p>Don't have an account?<Link to="/register">Register</Link></p>

      </div>
    </div>
  )
}

export default LoginPage
