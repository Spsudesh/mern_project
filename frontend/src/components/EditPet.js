import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchPetById, updatePet } from './API'; 
import logo from "../Images/logo.png"; 
import './Home.css';

const EditPetForm = ({ user, onLogout }) => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [size, setSize] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [color, setColor] = useState("");
  const [about, setAbout] = useState("");
  const [vaccinated, setVaccinated] = useState(false);
  const [neutered, setNeutered] = useState(false);
  const [medicalConditions, setMedicalConditions] = useState("");
  const [adoptionFee, setAdoptionFee] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getPetDetails = async () => {
      try {
        const data = await fetchPetById(petId);
        setName(data.name);
        setSpecies(data.species);
        setBreed(data.breed);
        setSize(data.size);
        setAge(data.age);
        setGender(data.gender);
        setColor(data.color);
        setAbout(data.about);
        setVaccinated(data.vaccinated);
        setNeutered(data.neutered);
        setMedicalConditions(data.medicalConditions);
        setAdoptionFee(data.adoptionFee);
        setImage(data.picture);
      } catch (err) {
        setMessage("Failed to fetch pet details.");
        console.error("Error fetching pet details:", err);
      }
    };

    getPetDetails();
  }, [petId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPet = {
      name,
      species,
      breed,
      size,
      age,
      gender,
      color,
      about,
      vaccinated,
      neutered,
      medicalConditions,
      adoptionFee,
      picture: image,
    };

    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

    try {
      await updatePet(petId, updatedPet, token);
      setMessage("Pet updated successfully!");
      navigate(`/petdetails/${petId}`);
    } catch (error) {
      setMessage("Failed to update pet.");
      console.error("Error updating pet:", error);
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
                 </span> </div>
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

      {/* Edit Pet Form */}
      <div className="container form-section">
        <h1 className="text-center">Edit Pet</h1>
        <p className="text-center">
          Please update the form below to edit the pet details.
        </p>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Species</label>
              <input
                type="text"
                className="form-control"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label">Breed</label>
              <input
                type="text"
                className="form-control"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                required
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Size</label>
              <input
                type="text"
                className="form-control"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Gender</label>
              <input
                type="text"
                className="form-control"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label">Color</label>
              <input
                type="text"
                className="form-control"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Vaccinated</label>
              <select
                className="form-control"
                value={vaccinated}
                onChange={(e) => setVaccinated(e.target.value === 'true')}
                required
              >
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label">Neutered</label>
              <select
                className="form-control"
                value={neutered}
                onChange={(e) => setNeutered(e.target.value === 'true')}
                required
              >
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </select>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Medical Conditions</label>
              <input
                type="text"
                className="form-control"
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label">Adoption Fee</label>
              <input
                type="number"
                className="form-control"
                value={adoptionFee}
                onChange={(e) => setAdoptionFee(e.target.value)}
                required
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                className="form-control"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div>
          </div>

          {/* New About field */}
          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label">About</label>
              <textarea
                className="form-control"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows="4"
                required
              />
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary px-4">Update Pet</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPetForm;