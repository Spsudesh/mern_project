import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the same CSS as Home for navbar styles
import logo from '../Images/logo.png';
import { fetchPets, fetchUser, submitAdoptionForm, fetchUserRequestsByToken } from './API';

// Safely read the stored user from localStorage
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

const Adopt = ({ user, onLogout }) => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [formMessage, setFormMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [myRequests, setMyRequests] = useState([]);
  const [speciesFilter, setSpeciesFilter] = useState('All');

  useEffect(() => {
    const getPets = async () => {
      try {
        const data = await fetchPets();
        setPets(data);
      } catch (err) {
        setError('Failed to fetch pets');
      } finally {
        setLoading(false);
      }
    };

    const getUser = async () => {
      const storedUser = getStoredUser();
      const token = storedUser?.token || null;
      const userId = storedUser?._id || null;
      if (token && userId) {
        try {
          const userData = await fetchUser(userId, token);
          const firstName = userData.firstName || '';
          const lastName = userData.lastName || '';
          const fullName = `${firstName} ${lastName}`.trim();
          setUserInfo({
            name: fullName || userData.name || '',
            email: userData.email || '',
            phone: userData.phoneNumber || userData.phone || '',
          });
        } catch (err) {
          console.error('Failed to fetch user', err);
        }
      }
    };

    const getMyRequests = async () => {
      const storedUser = getStoredUser();
      const token = storedUser?.token || null;
      if (token) {
        try {
          const data = await fetchUserRequestsByToken(token);
          setMyRequests(data);
        } catch (err) {
          console.error('Failed to fetch my requests', err);
        }
      }
    };

    getPets();
    getUser();
    getMyRequests();
  }, []);

  const handlePetChange = (e) => {
    setSelectedPet(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedPet) errors.selectedPet = 'Please select a pet';
    if (!userInfo.name) errors.name = 'Please enter your name';
    if (!userInfo.phone) errors.phone = 'Please enter your phone number';
    if (!userInfo.email) errors.email = 'Please enter your email';
    if (!addressLine) errors.addressLine = 'Please enter your address';
    if (!city) errors.city = 'Please enter your city';
    if (!zipCode) errors.zipCode = 'Please enter your postal/ZIP code';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    const storedUser = getStoredUser();
    const token = storedUser?.token || null;
    const userId = storedUser?._id || null;
    const formData = {
      user: userId, // Include user ID
      pet: selectedPet, // Ensure pet ID is sent
      name: userInfo.name,
      phoneNumber: userInfo.phone, // Ensure phoneNumber is sent
      email: userInfo.email,
      addressLine,
      city,
      zipCode,
    };

    try {
      await submitAdoptionForm(formData, token);
      setFormMessage('Adoption form submitted successfully!');
      // Clear form
      setSelectedPet('');
      setUserInfo({ name: '', email: '', phone: '' });
      setAddressLine('');
      setCity('');
      setZipCode('');
      // Refresh my requests (non-blocking)
      if (token) {
        fetchUserRequestsByToken(token)
          .then((data) => setMyRequests(data))
          .catch((refreshErr) => console.error('Failed to refresh requests after submit:', refreshErr));
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.message || 'Failed to submit adoption form.';
      setFormMessage(serverMsg);
      console.error('Error submitting adoption form:', err?.response?.data || err);
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

      {/* My Adoption Requests (only if any exist) */}
      {myRequests.length > 0 && (
        <div className="container form-section mt-4">
          <h2 className="text-center">My Adoption Requests</h2>
          <div className="row">
            {myRequests.map((req) => (
              <div className="col-12 mb-3" key={req._id}>
                <div className="p-3 border rounded">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>Application for:</strong> {req.pet?.name || 'Pet'}
                    </div>
                    <div>
                      <strong>Status:</strong> {req.status}
                    </div>
                  </div>
                  <div className="mt-2">
                    <small>Submitted on: {new Date(req.createdAt || req._id.toString().substring(0,8)).toLocaleString()}</small>
                  </div>
                  <div className="mt-2">
                    {req.status === 'Accepted' && (
                      <span className="text-success">We have accepted your request. We will contact you soon.</span>
                    )}
                    {req.status === 'Rejected' && (
                      <span className="text-danger">Sorry, your request was not approved. The pet may have been adopted by someone else.</span>
                    )}
                    {(!req.status || req.status === 'Pending') && (
                      <span>Pending review. We will update you shortly.</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adopt Form Section */}
      <div className="container form-section">
        <h1 className="text-center">Adopt A Pet</h1>
        <p className="text-center">
          Fill out the form below to submit your adoption application. Once a member of staff has reviewed your application, you will be contacted to meet your pet and complete the adoption process.
        </p>
        <div className="d-flex justify-content-center gap-2 mb-3">
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
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="petSelect" className="form-label">Pet</label>
            <select className="form-select" id="petSelect" value={selectedPet} onChange={handlePetChange}>
              <option value="">Choose a pet...</option>
              {pets.filter((p) => {
                const s = (p.species || '').toLowerCase();
                if (speciesFilter === 'All') return true;
                if (speciesFilter === 'Dog') return s === 'dog';
                if (speciesFilter === 'Cat') return s === 'cat';
                if (speciesFilter === 'Others') return s !== 'dog' && s !== 'cat';
                return true;
              }).map((pet) => (
                <option key={pet._id} value={pet._id}>
                  {pet.name}
                </option>
              ))}
            </select>
            {formErrors.selectedPet && <div className="text-danger">{formErrors.selectedPet}</div>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={userInfo.name}
                onChange={handleInputChange}
              />
              {formErrors.name && <div className="text-danger">{formErrors.name}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="phone" className="form-label">Phone number</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={userInfo.phone}
                onChange={handleInputChange}
              />
              {formErrors.phone && <div className="text-danger">{formErrors.phone}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={userInfo.email}
              onChange={handleInputChange}
            />
            {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
            {!user?.role === 'admin' && (
              <small>
                Already have an account? <Link to="/login" className="text-decoration-none">Login here</Link>
              </small>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <input type="text" className="form-control mb-2" id="addressLine1" placeholder="Address Line 1" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
            {formErrors.addressLine && <div className="text-danger">{formErrors.addressLine}</div>}
            <div className="row">
              <div className="col-md-6">
                <input type="text" className="form-control" id="city" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                {formErrors.city && <div className="text-danger">{formErrors.city}</div>}
              </div>
              <div className="col-md-6">
                <input type="text" className="form-control" id="postalCode" placeholder="Postal / ZIP code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                {formErrors.zipCode && <div className="text-danger">{formErrors.zipCode}</div>}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-submit px-4">Submit Application</button>
          </div>
        </form>
        {formMessage && <p className="text-center mt-3">{formMessage}</p>}
      </div>
    </>
  );
};

export default Adopt;