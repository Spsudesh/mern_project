import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactUs.css'; 
import './Home.css'; 
import logo from '../Images/logo.png';
import { submitContactForm, fetchContactForms } from './API';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (e) {
    return null;
  }
}

const ContactUs = ({ user, onLogout }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formMessage, setFormMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadContacts = async () => {
      const token = getStoredUser()?.token || null;
      if (user?.role === 'admin' && token) {
        try {
          const data = await fetchContactForms(token);
          setContacts(data);
        } catch (e) {
          setError('Failed to load contact enquiries');
        }
      }
    };
    loadContacts();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContactForm(formData);
      setFormMessage('Contact form submitted successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setFormMessage('Failed to submit contact form.');
      console.error('Error submitting contact form:', err);
    }
  };

  const toggleFlagsOnSubject = (subject, { read, contacted }) => {
    let base = subject || '';
    // Remove existing flags
    base = base.replace(/\s*\[READ\]/gi, '').replace(/\s*\[CONTACTED\]/gi, '').trim();
    const flags = [];
    if (read) flags.push('[READ]');
    if (contacted) flags.push('[CONTACTED]');
    return `${base}${flags.length ? ' ' + flags.join(' ') : ''}`;
  };

  const parseFlagsFromSubject = (subject) => {
    const s = subject || '';
    return {
      read: /\[READ\]/i.test(s),
      contacted: /\[CONTACTED\]/i.test(s)
    };
  };

  const updateContact = async (contact, changes) => {
    const token = getStoredUser()?.token || null;
    if (!token) return;
    const nextFlags = { ...parseFlagsFromSubject(contact.subject), ...changes };
    const nextSubject = toggleFlagsOnSubject(contact.subject, nextFlags);
    try {
      const res = await fetch(`http://localhost:5000/api/contact-forms/${contact._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject: nextSubject }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setContacts((prev) => prev.map((c) => (c._id === contact._id ? { ...c, subject: nextSubject } : c)));
    } catch (e) {
      setError('Failed to update enquiry');
      console.error(e);
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

      {/* Contact Section */}
      <div className="container py-5">
        {/* Header */}
        <div className="container-header">
          <h1 className="fw-bold">{user?.role === 'admin' ? 'Enquiries' : 'Contact'}</h1>
        </div>

        {/* Contact Information (hidden for admin) */}
        {user?.role !== 'admin' && (
          <div className="contact-info-simple">
            <p>📞 Phone: 7588496959 • ✉️ Email: polsudesh51@gmail.com • 📄 Address: Islampur</p>
          </div>
        )}

        {/* If admin, show enquiries list; otherwise show contact form */}
        {user?.role === 'admin' ? (

<div className="table-container">

          <div className="table-responsive" style={{ border: '2px solid #0d6efd', borderRadius: '12px', boxShadow: '0 8px 20px rgba(13,110,253,.15)' }}>
            {/* <h2 className="fw-bold text-center mb-3" style={{ color: '#0d6efd' }}>Enquiries</h2> */}
            {error && <p className="text-danger text-center">{error}</p>}
            {contacts.length === 0 ? (
              <p className="text-center">No enquiries yet.</p>
            ) : (
              <table className="table table-striped table-hover" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead style={{ background: '#eaf4ff', borderTop: '2px solid #0d6efd', color: '#0b5ed7' }}>
                  <tr>
                    <th style={{ borderBottom: '2px solid #000000 ' }}>Name</th>
                    <th style={{ borderBottom: '2px solid #0d6efd' }}>Email</th>
                    <th style={{ borderBottom: '2px solid #0d6efd' }}>Subject</th>
                    <th style={{ borderBottom: '2px solid #0d6efd' }}>Message</th>
                    <th style={{ borderBottom: '2px solid #0d6efd' }}>Status</th>
                    <th style={{ borderBottom: '2px solid #0d6efd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => {
                    const flags = parseFlagsFromSubject(c.subject);
                    return (
                      <tr key={c._id} style={{ marginBottom: '20px' }}>
                        <td style={{ borderTop: '1px solid #cfe2ff' }}>{c.firstName} {c.lastName}</td>
                        <td style={{ borderTop: '1px solid #cfe2ff' }}>{c.email}</td>
                        <td style={{ borderTop: '1px solid #cfe2ff' }}>{c.subject}</td>
                        <td style={{ borderTop: '1px solid #cfe2ff', maxWidth: '360px', whiteSpace: 'pre-wrap' }}>{c.message}</td>
                        <td style={{ borderTop: '1px solid #cfe2ff' }}>
                          <span className={`badge me-1 ${flags.read ? 'bg-success' : 'bg-secondary'}`}>{flags.read ? 'Read' : 'Unread'}</span>
                          <span className={`badge ${flags.contacted ? 'bg-info text-dark' : 'bg-secondary'}`}>{flags.contacted ? 'Contacted' : 'Not Contacted'}</span>
                        </td>
                        <td style={{ borderTop: '1px solid #cfe2ff' }}>
                          <button className="btn btn-sm btn-outline-success me-2" onClick={() => updateContact(c, { read: !flags.read })}>{flags.read ? 'Mark Unread' : 'Mark Read'}</button>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => updateContact(c, { contacted: !flags.contacted })}>{flags.contacted ? 'Mark Not Contacted' : 'Mark Contacted'}</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          </div>      
          
        ) : (
          <div className="contact-form-new">
            <div className="form-header">
              <h2 className="form-title">🐾 Send Us a Message 🐾</h2>
              <p className="form-subtitle">We'd love to hear from you! Fill out the form below and we'll get back to you soon.</p>
            </div>
            <form onSubmit={handleSubmit} className="modern-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">👤 First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your first name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">👤 Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">📧 Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">💬 Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="What's this about?"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">📝 Your Message</label>
                <textarea
                  className="form-textarea"
                  rows="5"
                  placeholder="Tell us more about your inquiry..."
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="form-submit">
                <button type="submit" className="submit-btn">
                  <span className="btn-icon">🚀</span>
                  Send Message
                </button>
              </div>
            </form>
            {formMessage && <div className="form-message">{formMessage}</div>}
          </div>
        )}
      </div>
    </>
  );
};

export default ContactUs;