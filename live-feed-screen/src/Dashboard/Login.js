import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';

function Login() {
  const navigate = useNavigate(); // Updated: Renamed to 'navigate'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignin = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!email.match(emailPattern)) {
        setError('Please enter a valid email');
        return;
    } else if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
    }

    try {
        const res = await axios.post('https://live-feed-attendance-react-cojag.onrender.com/api/auth/signin', { email, password });

        if (res.status === 200) {
            console.log("Login successful.");
            localStorage.setItem('authToken', res.data.token); // Save the token
            localStorage.setItem('username', res.data.name); // Save the username
            navigate("/dashboard", { state: { id: email } }); // Navigate to dashboard
            console.log(res.data);
        } else {
            // Handle different responses here
            if (res.status === 401) {
                setError('Invalid email or password');
            } else if (res.status === 500) {
                setError('Internal Server Error');
            }
        }
    } catch (error) {
        console.error('Error signing in:', error.response?.data?.error || error.message);
        setError('Error signing in');
    }
};


  return (
    <div className="login-container">
      <div className="brand-container">
        <h1>Cojag Smart Technology</h1>
        <p>
          Welcome to Cojag Smart Technology's platform. Please log in to access advanced face and object detection services.
        </p>
      </div>
      <div className="login-form-container">
        <form className="login-form" onSubmit={handleSignin}>
          <h2>Login</h2>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email" // Updated: Changed type to 'email'
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p className="signup-option">
            Don't have an account ? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
