import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css'; 
import './Home.css'; 
import logo from '../Images/logo.png';
import petImage1 from '../Images/11.jpg';
import petImage2 from '../Images/2.jpg';
import petImage3 from '../Images/8.jpg';
import petImage4 from '../Images/9.jpg';

const AboutUs = ({ user, onLogout }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const petImages = [petImage1, petImage2, petImage3, petImage4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % petImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [petImages.length]);

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
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {user?.role === 'admin' ? (
                <>
                  <li className="nav-item"><Link className="nav-link custom-nav-link text-white" to="/admin">Admin Dashboard</Link></li>
                  <li className="nav-item"><Link className="nav-link custom-nav-link text-white" to="/requests">Requests</Link></li>
                  <li className="nav-item"><Link className="nav-link custom-nav-link text-white" to="/contact">Enquiries</Link></li>
                  <li className="nav-item"><Link className="nav-link custom-nav-link text-white" to="/about">About Us</Link></li>
                  <li className="nav-item">
                    <button className="btn nav-link custom-nav-link text-white border-0 bg-transparent" onClick={onLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item"><Link className="nav-link custom-nav-link text-white" to="/">Home</Link></li>
                  <li className="nav-item"><Link className="nav-link custom-nav-link text-white" to="/pets">Pets</Link></li>
                  <li className="nav-item"><Link className="nav-link custom-nav-link text-white" to="/adopt">Adopt</Link></li>
                  <li className="nav-item"><Link className="nav-link custom-nav-link text-white" to="/about">About Us</Link></li>
                  <li className="nav-item"><Link className="nav-link custom-nav-link text-white" to="/contact">Contact Us</Link></li>
                  {user ? (
                    <li className="nav-item"><button className="btn nav-link custom-nav-link text-white border-0 bg-transparent" onClick={onLogout}>Logout</button></li>
                  ) : (
                    <li className="nav-item"><Link className="nav-link custom-nav-link text-white active" to="/login">Login</Link></li>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="paw-print">🐾</span> Welcome to Our Pet Family! <span className="paw-print">🐾</span>
          </h1>
          <p className="hero-subtitle">
            Where every tail wags with joy and every heart finds its perfect match!
          </p>
        </div>
        <div className="floating-pets">
          <div className="pet-emoji">🐕</div>
          <div className="pet-emoji">🐱</div>
          <div className="pet-emoji">🐰</div>
          <div className="pet-emoji">🐹</div>
          <div className="pet-emoji">🐦</div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="story-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="story-content">
                <h2 className="section-title">
                  <span className="heart">💖</span> Our Story <span className="heart">💖</span>
                </h2>
                <p className="story-text">
                  Once upon a time, we dreamed of a world where every pet finds a loving home and every child learns the magic of caring for animals. That's how our pet shelter was born! 🌟
                </p>
                <p className="story-text">
                  We believe that pets aren't just animals - they're family members who teach us about love, responsibility, and the joy of giving. Every day, we work to make sure our furry, feathered, and scaly friends find their perfect forever families! 🏠✨
                </p>
                <div className="stats-container">
                  <div className="stat-item">
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Happy Pets Adopted</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">1000+</div>
                    <div className="stat-label">Smiling Families</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">24/7</div>
                    <div className="stat-label">Love & Care</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="image-carousel">
                <img 
                  src={petImages[currentImage]} 
                  alt="Our adorable pets" 
                  className="carousel-image"
                />
                <div className="carousel-dots">
                  {petImages.map((_, index) => (
                    <span 
                      key={index} 
                      className={`dot ${index === currentImage ? 'active' : ''}`}
                      onClick={() => setCurrentImage(index)}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="values-section">
        <div className="container">
          <h2 className="section-title text-center">
            <span className="star">⭐</span> What Makes Us Special <span className="star">⭐</span>
          </h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>Love & Care</h3>
                <p>Every pet receives endless love, proper medical care, and lots of cuddles until they find their perfect family!</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="value-card">
                <div className="value-icon">👨‍👩‍👧‍👦</div>
                <h3>Family Matching</h3>
                <p>We carefully match each pet with the perfect family, making sure everyone will be happy together forever!</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="value-card">
                <div className="value-icon">🎓</div>
                <h3>Learning Together</h3>
                <p>We teach kids and families how to be the best pet parents through fun activities and helpful tips!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    

      {/* Call to Action */}
      <div className="cta-section">
        <div className="container text-center">
          <h2 className="cta-title">
            Ready to Add Some Paws to Your Family? <span className="paw-print">🐾</span>
          </h2>
          <p className="cta-text">
            Join hundreds of happy families who found their perfect pet companion with us!
          </p>
          <div className="cta-buttons">
            <Link to="/pets" className="btn btn-primary cta-btn">
              <span className="btn-icon">🐕</span> Meet Our Pets
            </Link>
            <Link to="/adopt" className="btn btn-outline-primary cta-btn">
              <span className="btn-icon">💝</span> Start Adoption
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
