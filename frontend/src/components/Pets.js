import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css"; 
import logo from "../Images/logo.png";
import { fetchPets, imageUrl } from './API';

const Pets = ({ user, onLogout }) => {
  const [pets, setPets] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Add search state
  const [speciesFilter, setSpeciesFilter] = useState('All');

  useEffect(() => {
    const getPets = async () => {
      try {
        const data = await fetchPets();
        setPets(data);
      } catch (err) {
        console.error('Failed to fetch pets', err);
      }
    };

    getPets();
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

      {/* Light Blue Section */}
      <div className="container light-blue-section">
        <h1 className="text-center">Meet The Pets</h1>
        <p className="text-center">
          Adopting a pet is a wonderful way to bring love and companionship into your life while giving an animal a second chance at a happy home.
        </p>

        {/* Search */}
      
        <div className="search-controls d-flex flex-column align-items-center">
          <form className="d-flex align-items-center mb-2">
            <input
              className="form-control me-2 w-50 search-bar"
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="btn btn-search" type="submit">Search</button>
          </form>
          <div className="d-flex justify-content-center gap-2">
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
      </div>

      {/* Pets Section */}
      <div className="container">
        <div className="row">
          {filteredPets.length === 0 ? (
            <div className="col-12">
              <p className="text-center">No pets available at the moment.</p>
            </div>
          ) : (
            filteredPets.map((pet) => (
              <div className="col-md-4 mb-4" key={pet._id}>
                <Link to={`/petdetails/${pet._id}`} className="text-decoration-none">
                  <div className="card">
                    <img src={imageUrl(pet.picture)} className="card-img-top" alt={`Pet named ${pet.name}`} />
                    <div className="card-body">
                      <h5 className="card-title">{pet.name}</h5>
                      <p className="card-text">{pet.age} years | {pet.gender}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Pets;