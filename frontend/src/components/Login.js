import React from 'react';
import  { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import './Login.css'; 
import './Home.css';
import logo from '../Images/logo.png'; 

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
      //const response = await fetch('http://34.234.116.129:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to log in');
      }

      const data = await response.json();
      onLogin({ ...data.user, token: data.token });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
            <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="Logo" style={{ height: '70px', marginRight: '-1px', marginTop: '-20px' }} />
            <div className="d-flex flex-column">
            <span
                   className="pet-shelter-brand"
                   style={{
                     fontSize: '2rem',
                     fontFamily: "'Fredoka One', cursive, 'Segoe UI', Arial",
                     letterSpacing: '1px',
                     color: '#8B4513',
                     lineHeight: 1,
                     textShadow: '2px 2px 4px rgba(139, 69, 19, 0.3)',
                   }}
                 >
                   Pet Shelter
                 </span>
                 <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#9A3F3F', fontWeight: '900'}}>
                   Where Families Grow with Pets
                 </span>
            </div>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
         
           <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                      <li className="nav-item"><Link className="nav-link custom-nav-link text-white" to="/">Home</Link></li>
                      <li className="nav-item"><Link className="nav-link custom-nav-link text-white" to="/pets">Pets</Link></li>
                      <li className="nav-item"><Link className="nav-link custom-nav-link text-white" to="/adopt">Adopt</Link></li>
                  
                      <li className="nav-item"><Link className="nav-link custom-nav-link text-white" to="/about">About Us</Link></li>
                      <li className="nav-item"><Link className="nav-link custom-nav-link text-white" to="/contact">Contact Us</Link></li>
                        <li className="nav-item"><Link className="nav-link custom-nav-link text-white active" to="/login">Login</Link></li>
                    
                    </ul>
                  </div>



        </div>
      </nav>

      {/* Login Form */}
      <div className="login-container">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h1 className="login-title">🐾 Welcome Back! 🐾</h1>
            <p className="login-subtitle">Sign in to your account and continue your pet adoption journey!</p>
          </div>
          
          <form onSubmit={handleLogin} className="modern-login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">📧 Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                id="email" 
                placeholder="your.email@example.com"
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">🔒 Password</label>
              <input 
                type="password" 
                className="form-input" 
                id="password" 
                placeholder="Enter your password"
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="forgot-password">
              <Link to="/forgot-password">🤔 Forgot Password?</Link>
            </div>
            
            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              <span className="btn-icon">{loading ? '⏳' : '🚀'}</span>
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
            
            <div className="signup-link">
              Don't have an account? <Link to="/signup">🎉 Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;