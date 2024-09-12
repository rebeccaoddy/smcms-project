import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.token); // Store the token
      setUser(response.data);
      navigate('/cases');
    } catch (error) {
      console.error('Error logging in', error);
      alert('Login failed, please check your credentials and try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <div className="register-link">
        <p>Don't have an account?</p>
        <button onClick={() => navigate('/register')}>Register Here</button>
      </div>
    </div>
  );
};

export default Login;
