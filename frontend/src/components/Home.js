import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import logo from '../Images/logo.png';
import { fetchPets, imageUrl } from './API';

const Home = ({ user, onLogout }) => {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');      //to  Add search state
  const [speciesFilter, setSpeciesFilter] = useState('All');

  
  useEffect(() => {
    const getPets = async () => {
      try {
        const petsData = await fetchPets();
        setPets(petsData);
      } catch (error) {
        setError('Failed to fetch pets');
        console.error('Error fetching pets:', error);
      }
    };

    getPets();
  }, []);

  // Set document title and favicon on mount
  useEffect(() => {
    document.title = 'Pet Shelter';
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      favicon.href = logo;
    } else {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = logo;
      document.head.appendChild(link);
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const speciesMatches = (species) => {
    const s = (species || '').toLowerCase();
    if (speciesFilter === 'All') return true;
    if (speciesFilter === 'Dog') return s === 'dog';
    if (speciesFilter === 'Cat') return s === 'cat';
    if (speciesFilter === 'Others') return s !== 'dog' && s !== 'cat';
    return true;
  };

  const filteredPets = pets.filter((pet) =>
    (pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchQuery.toLowerCase())) &&
    speciesMatches(pet.species)
  );

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
                    <li className="nav-item">
                      <button className="btn nav-link custom-nav-link text-white border-0 bg-transparent" onClick={onLogout}>Logout</button>
                    </li>
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
      <div className="light-blue-background">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-md-6 text-center">
              <h1 style={{ color: '#030404' }}>Adopt A Cute Pet</h1>
              <p>Find your furry friend today!</p>
              <form className="d-flex justify-content-center mb-2">
                <input
                  className="form-control me-2 w-50 search-bar"
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button className="btn btn-search" type="submit">
                  Search
                </button>
              </form>
              <div className="d-flex justify-content-center gap-2 mb-4">
                {['All','Dog','Cat','Others'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    className={`btn ${speciesFilter===label ? 'btn-warning' : 'btn-outline-warning'} btn-sm`}
                    onClick={() => setSpeciesFilter(label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img
                src={require('../Images/10.jpg')}
                alt="Welcome to Pet Shelter"
                className="img-fluid rounded shadow"
                style={{ maxHeight: '350px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pet Images Section */}
      <div className="container mt-5">
        <div className="row">
          {/* Error Message */}
          {error && <p className="text-danger">{error}</p>}

          {/* Display pets if they exist, otherwise show a message */}
          {filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex align-items-stretch" key={pet._id}>
                <div
                  className="card h-100 shadow-sm"
                  style={{
                    width: '100%',
                    minWidth: '250px',
                    maxWidth: '300px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ width: '100%', height: '220px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={imageUrl(pet.picture)}
                      alt={pet.name}
                      className="card-img-top"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{pet.name}</h5>
                    <p className="card-text mb-1"><strong>Species:</strong> {pet.species}</p>
                    <p className="card-text mb-1"><strong>Breed:</strong> {pet.breed}</p>
                    {/* Optionally add more info here */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No pets available for adoption.</p>
          )}
        </div>
      </div>

      {/* Extra bottom margin at the end of the page */}
      <div style={{ height: '120px' }}></div>
    </>
  );
};

export default Home;