import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginTable.css';

const LoginPage = () => {
  // Define your user data
  const users = {
    manufacturer: { username: 'manufactureruser', password: 'password' },
    wholesaler: { username: 'wholesaleruser', password: 'wholesalerpassword' },
    retailer: { username: 'retaileruser', password: 'retailerpassword' },
    consumer: { username: 'consumeruser', password: 'consumerpassword' },
  };

  // State variables to hold form input values
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('manufacturer');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = (e) => {
   
    //this.setUsername({[e.target.username]: e.target.setUsername});
    const requestBody = {
      username: username,
      password: password,
      userRole: userRole,
    };
    fetch('http://localhost:3000/login', {
      method: 'POST',
      //mode: "no-cors",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.sessiontoken)
        if (data.sessiontoken) {
          localStorage.setItem('token', data.sessiontoken);
          localStorage.setItem('id', data.id);
          
          navigate('/ProductTable');
        } else {
          alert('Token verification failed. Please check your credentials.');
        }
  })
      .catch((error) => {
        console.error('Error:', error);
      });
      e.preventDefault();
  };

  // Event handler for forgot password
  const forgotPassword = () => {
    // Implement your forgot password logic here
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="logo">
          <img
            src="https://www.gs1india.org/wp-content/uploads/2022/06/logo-600x402-1-600x402.png"
            alt="DataKart"
          />
        </div>

        <div className="login-container">
          <div className="login-form">
            <div className="login-heading">DataKart Login</div>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="userRole">User Role:</label>
                <select
                  id="userRole"
                  name="userRole"
                  required
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <option value="manufacturer">Manufacturer</option>
                  <option value="wholesaler">Wholesaler</option>
                  <option value="retailer">Retailer</option>
                  <option value="consumer">Consumer</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit">Login</button>
            </form>

            <div className="forgot-password">
              <button type="button" onClick={forgotPassword}>
                Forgot Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;