import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventList from '../components/EventList';
import { getToken, isTokenExpired, removeToken } from '../api';
import './styles.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (isTokenExpired(token)) {
      removeToken();
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    window.location.href = 'http://localhost:3001/';

  };

  return (
    <div>
      <div className='main'>
        <button onClick={handleLogout}>Logout</button>
        <h1>Event Manager</h1>
        <EventList />
      </div>
    </div>
  );
};

export default Home;
