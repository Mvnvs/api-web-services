import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login, setToken } from '../api';
import './styles.css';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    if (token) {
      setToken(token);
      navigate('/home');  // Rediriger vers la page d'accueil
    }
  }, [location, navigate]);

  return (
    <div className="login-container">
      <h1>Event Manager</h1>
      <p>Please sign in to access your account.</p>
      <button onClick={login}>
        <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google Icon" className="google-icon"/>
        Login with Google
      </button>
      <div className="presentation">
        <h2>Welcome to Event Manager</h2>
        <p>Event Manager is your platform for organizing and managing events effortlessly.</p>
        <p>With Event Manager, you can:</p>
        <ul>
          <li>Create and schedule new events</li>
          <li>Invite participants and manage RSVPs</li>
          <li>View and update event details</li>
          <li>And much more!</li>
        </ul>
        <p>Join us and start managing your events seamlessly today!</p>
      </div>
      <div className="footer">
        Powered by Emmanuel Ahkkash and Zayed
      </div>
    </div>
  );
};

export default Login;
