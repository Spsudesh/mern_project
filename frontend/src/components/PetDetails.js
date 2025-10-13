import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './Home.css';
import logo from '../Images/logo.png';
import { fetchPetById, imageUrl } from './API';

const PetDetails = ({ user, onLogout }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPetById(petId);
        setPet(data);
      } catch (e) {
        setError('Failed to load pet details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [petId]);

  const goToAdopt = () => {
    navigate('/adopt');
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

      <div className="container py-5">
        {loading && <p className="text-center">Loading pet...</p>}
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {!loading && pet && (
          <div className="row g-4 align-items-start">
            <div className="col-12 col-lg-6">
              <div className="rounded shadow overflow-hidden" style={{ background: '#fff' , margintop: '10px' }}>
                <img
                  src={imageUrl(pet.picture)}
                  alt={pet.name}
                  className="img-fluid"
                  style={{ width: '100%', height: '420px', objectFit: 'cover' }}
                />
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="p-4 rounded shadow" style={{ background: '#ffffff' }}>
                <h2 className="mb-2">{pet.name}</h2>
                <p className="text-muted mb-3">{pet.breed} • {pet.gender} • {pet.age} years</p>

                <div className="row g-3 mb-4">
                  <div className="col-6 col-md-4">
                    <div className="border rounded p-3 text-center h-100">
                      <div className="small text-uppercase text-muted">Species</div>
                      <div className="fw-bold">{pet.species}</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="border rounded p-3 text-center h-100">
                      <div className="small text-uppercase text-muted">Size</div>
                      <div className="fw-bold">{pet.size}</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="border rounded p-3 text-center h-100">
                      <div className="small text-uppercase text-muted">Color</div>
                      <div className="fw-bold">{pet.color}</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="border rounded p-3 text-center h-100">
                      <div className="small text-uppercase text-muted">Vaccinated</div>
                      <div className="fw-bold">{pet.vaccinated ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="border rounded p-3 text-center h-100">
                      <div className="small text-uppercase text-muted">Neutered</div>
                      <div className="fw-bold">{pet.neutered ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="border rounded p-3 text-center h-100">
                      <div className="small text-uppercase text-muted">Adoption Fee</div>
                      <div className="fw-bold">₹ {pet.adoptionFee}</div>
                    </div>
                  </div>
                </div>

                <h5> <b> About {pet.name} </b>  </h5>
                <p className="mb-3" style={{ whiteSpace: 'pre-line' }}>{pet.about}</p>
                {pet.medicalConditions && (
                  <div className="mb-4">
                    <h6 className="mb-1"><b>   Medical Conditions   </b> </h6>
                    <p className="mb-0">{pet.medicalConditions}</p>
                  </div>
                )}

                <div className="d-flex gap-3">
                  <button className="btn btn-submit px-4" onClick={goToAdopt}>Apply to Adopt</button>
                  <Link className="btn btn-outline-secondary px-4" to="/pets">Back to Pets</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PetDetails;
