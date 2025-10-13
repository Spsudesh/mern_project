import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './Requests.css';
import logo from '../Images/logo.png'; 
import { fetchUserRequestsByToken, fetchAdoptionRequests, updateRequestStatus } from './API'; 

// Safely read the stored user
function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
    return null;
  } catch (e) {
    return null;
  }
}

const Requests = ({ user, onLogout }) => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getRequests = async () => {
      const storedUser = getStoredUser();
      const token = storedUser?.token || null;
      if (token) {
        try {
          let data;
          if (user.role === 'admin') {
            data = await fetchAdoptionRequests(token);
          } else {
            data = await fetchUserRequestsByToken(token);
          }
          setRequests(data);
        } catch (err) {
          setError('Failed to fetch requests');
          console.error('Error fetching requests:', err);
        }
      } else {
        setError('User not authenticated');
      }
    };

    getRequests();
  }, [user]);

  // Redirect non-admin users
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handleStatusUpdate = async (requestId, status) => {
    const token = getStoredUser()?.token || null;
    if (token) {
      try {
        await updateRequestStatus(requestId, status, token);
        setRequests(requests.map(request => request._id === requestId ? { ...request, status } : request));
      } catch (err) {
        setError('Failed to update request status');
        console.error('Error updating request status:', err);
      }
    }
  };

  const filteredRequests = requests.filter((request) => {
    const petName = request?.pet?.name || '';
    const adopterName = request?.name || '';
    const q = searchQuery.toLowerCase();
    return petName.toLowerCase().includes(q) || adopterName.toLowerCase().includes(q);
  });

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

      {/* Main Content */}
      <div className="container py-5">
        <div className="container-header">
          <h1 className="fw-bold">Submitted Adoption Request Forms</h1>
        </div>
                        
        <div className="table-container">
          <div className="filter-buttons">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by Pet Name or User Name"
                className="form-control"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">🔍</button>
            </div>
          </div>

          {filteredRequests.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Pet Name</th>
                  <th>Adopter Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request?.pet?.name || 'Pet'}</td>
                    <td>{request?.name || '-'}</td>
                    <td>{request?.status || 'Pending'}</td>
                    <td>
                      <button className="btn btn-success me-2" onClick={() => handleStatusUpdate(request._id, 'Accepted')}>Accept</button>
                      <button className="btn btn-danger" onClick={() => handleStatusUpdate(request._id, 'Rejected')}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No adoption requests found.</p>
          )}
          {error && <p className="text-danger">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default Requests;