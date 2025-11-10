import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './SignUp.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CASHIER',
    agreeTerms: false
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated - use role-based redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.role ? user.role.toUpperCase() : null;
      console.log('SignUp useEffect - Already authenticated, user role:', userRole);
      if (userRole === 'CHEF') {
        navigate('/chef-dashboard');
      } else if (userRole === 'CASHIER') {
        navigate('/cashier-dashboard');
      } else if (userRole === 'MANAGER' || userRole === 'ADMIN') {
        navigate('/manager-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
    setError(''); // Clear error on input change
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    if (passwordStrength < 50) {
      setError('Please use a stronger password');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      if (result.success) {
        // Navigate to role-specific dashboard
        const userRole = result.user?.role ? result.user.role.toUpperCase() : null;
        console.log('SignUp - User role:', userRole, 'User object:', result.user);
        if (userRole === 'CHEF') {
          navigate('/chef-dashboard');
        } else if (userRole === 'CASHIER') {
          navigate('/cashier-dashboard');
        } else if (userRole === 'MANAGER' || userRole === 'ADMIN') {
          navigate('/manager-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Particle background effect
  useEffect(() => {
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 80 + 20}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${Math.random() * 25 + 15}s`;
        particlesContainer.appendChild(particle);
      }
    }
  }, []);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return '#e53e3e';
    if (passwordStrength < 50) return '#ed8936';
    if (passwordStrength < 75) return '#ecc94b';
    return '#38a169';
  };

  return (
    <>
      <div className="particles"></div>
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1>Create Account</h1>
            <p>Join us today and unlock amazing features</p>
          </div>

 

          <form className="signup-form" onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '12px',
                marginBottom: '16px',
                backgroundColor: '#fee',
                color: '#c33',
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                disabled={isLoading}
              />
              <div className="password-strength">
                <div 
                  className="strength-bar" 
                  style={{
                    width: `${passwordStrength}%`,
                    background: getPasswordStrengthColor()
                  }}
                ></div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="CASHIER">Cashier - Process orders</option>
                <option value="CHEF">Chef - Manage inventory</option>
                <option value="MANAGER">Manager - Manage staff and operations</option>
              </select>
            </div>

            <div className="terms-container">
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className="terms-checkmark"></span>
                <span className="terms-text">
                  I agree to the <a href="#terms" className="terms-link">Terms of Service</a> and <a href="#privacy" className="terms-link">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button type="submit" className="signup-button" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="signup-footer">
            <p>Already have an account? <a href="/signin" className="signin-link">Sign in</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
