import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

function Register() {
  const history = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email.match(emailPattern)) {
      setError('Please enter a valid email');
      return;
    } else if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/auth/signup', { name, email, password });

      if (res.status === 201) {
        history("/");
      } else {
        setError('Error creating account');
      }
    } catch (error) {
      console.error('Error signing up:', error.response.data.error);
      setError('Error signing up');
    }
  };

  return (
    <div className="register-container">
      <div className="brand-container">
        <h1>Cojag Smart Technology</h1>
        <p>
          Create an account to start using Cojag Smart Technology's advanced face and object detection services.
        </p>
      </div>
      <div className="register-form-container">
        <form className="register-form" onSubmit={handleRegister}>
          <h2>Sign Up</h2>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit">Sign Up</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p className="login-option">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;