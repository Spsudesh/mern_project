import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css"; 
import logo from "../Images/logo.png"; 
import { fetchPets, deletePet, fetchContactForms, imageUrl } from './API';
import './Home.css';


const Admin = ({ user, onLogout }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState([]);
  const [speciesFilter, setSpeciesFilter] = useState('All');

  useEffect(() => {
    const getPets = async () => {
      try {
        const data = await fetchPets();
        setPets(data);
      } catch (err) {
        setError('Failed to fetch pets');
        console.error('Error fetching pets:', err);
      } finally {
        setLoading(false);
      }
    };

    getPets();
  }, []);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        if (token) {
          const data = await fetchContactForms(token);
          setContacts(data);
        }
      } catch (err) {
        console.error('Error fetching contact forms:', err);
      }
    };
    if (user?.role === 'admin') {
      getContacts();
    }
  }, [user]);

  // Handle deleting a pet
  const handleDeletePet = async (petId) => {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    const confirmDelete = window.confirm("Are you sure you want to delete this pet?");
    if (confirmDelete) {
      try {
        await deletePet(petId, token);
        setPets(pets.filter(pet => pet._id !== petId));
      } catch (err) {
        console.error('Failed to delete pet:', err);
      }
    }
  };

  // Handle editing a pet
  const handleEditPet = (petId) => {
    navigate(`/admin/edit-pet/${petId}`);
  };

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
            <img src={logo} alt="Logo" style={{ height: '48px', marginRight: '10px' }} />
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
                            <li className="nav-item"><button className="btn nav-link custom-nav-link text-white border-0 bg-transparent" onClick={onLogout}>Logout</button></li>
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
    
      
      <div className="container light-blue-section">
        <h1 className="text-center">Admin Dashboard</h1>
        
        {/* Filter, Sort, and Search */}

        <div className="search-controls d-flex flex-column align-items-center">
          <form className="d-flex align-items-center mb-2">
            <input
              className="form-control me-2 w-50 search-bar"
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
                style={{ width: '500px' }}
              
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

      {/* Admin Controls */}
      {user?.role === 'admin' && (
        <div className="container">
          <div className="row">
            <Link to="/admin/add-pet">
              <button className="btn btn-success mb-4">Add New Pet</button>
            </Link>
          </div>
        </div>
      )}

      {/* Pets Section */}
      <div className="container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <div className="row">
            {filteredPets.map((pet) => (
              <div className="col-md-4 mb-4" key={pet._id}>
                <div className="card">
                  <img src={imageUrl(pet.picture)} className="card-img-top" alt={pet.name} />
                  <div className="card-body">
                    <h5 className="card-title">{pet.name}</h5>
                    <p className="card-text">{pet.age} years | {pet.gender}</p>
                    {user?.role === 'admin' && (
                      <div>
                        <button className="btn btn-primary me-2" onClick={() => handleEditPet(pet._id)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDeletePet(pet._id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Messages Section */}
      {user?.role === 'admin' && (
        <div className="container mt-4">
          <h2>Contact Messages</h2>
          {contacts.length === 0 ? (
            <p>No contact messages.</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c._id}>
                      <td>{c.firstName} {c.lastName}</td>
                      <td>{c.email}</td>
                      <td>{c.subject}</td>
                      <td>{c.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Admin;