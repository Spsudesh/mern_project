import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import axios from "axios";
import "./SignUp.css";
import logo from "../Images/logo.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "user" 
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://mern-project-q1ob.onrender.com/api/users/signup", formData);
      setMessage("User created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <>
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

      <div className="form-container">
        <h1>Sign Up</h1>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input type="text" className="form-control" id="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input type="text" className="form-control" id="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input type="tel" className="form-control" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
      </div>
    </>
  );
};

export default SignUp;