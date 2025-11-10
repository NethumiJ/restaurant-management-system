import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './signin.css';

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated - use role-based redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.role ? user.role.toUpperCase() : null;
      console.log('SignIn useEffect - Already authenticated, user role:', userRole);
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
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn({ email: formData.email, password: formData.password });

      if (result.success) {
        // Navigate to role-specific dashboard on successful sign in
        const userRole = result.user?.role ? result.user.role.toUpperCase() : null;
        console.log('SignIn - User role:', userRole, 'User object:', result.user);
        if (userRole === 'CHEF') {
          navigate('/chef-dashboard');
        } else if (userRole === 'CASHIER') {
          navigate('/cashier-dashboard');
        } else if (userRole === 'MANAGER' || userRole === 'ADMIN') {
          navigate('/manager-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else if (result.resetRequired) {
        // Redirect to first-login password set page
        navigate(`/complete-first-login?userId=${encodeURIComponent(result.userId)}`);
      } else {
        setError(result.error || 'Failed to sign in. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Particle background effect
  useEffect(() => {
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 60 + 20}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 10}s`;
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        particlesContainer.appendChild(particle);
      }
    }
  }, []);

  return (
    <>
      <div className="particles"></div>
      <div className="signin-container">
        <div className="signin-card">
          <div className="signin-header">
            <h1>Welcome Back</h1>
            <p>Please sign in to your account</p>
          </div>

          <form className="signin-form" onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="/request-reset" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="signin-button" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="signin-footer">
            <p>Don't have an account? <a href="/signup" className="signup-link">Sign up</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
