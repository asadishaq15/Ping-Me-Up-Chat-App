import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import RegisterPage from './pages/registerPage';
import "./style.scss"
import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/authContext';
import { ChatContextProvider } from './context/chatContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<AuthContextProvider>
  <ChatContextProvider>
  <React.StrictMode>
    <App/>
  </React.StrictMode>

  </ChatContextProvider>
</AuthContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
