import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setSubmitting(true);

    try {
      // Send registration credentials as urlencoded payload
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('email', email);
      params.append('password', password);

      const response = await api.post('/signup', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Axios follows the redirect. Check final redirected URL.
      const finalUrl = response.request.responseURL || '';
      if (finalUrl.includes('/signup')) {
        setErrorMsg('User registration failed. Username/Email might already be taken.');
      } else {
        // Successful signup & automatic login
        if (login) {
          login(username);
        }
        navigate('/listings');
      }
    } catch (err) {
      console.error('Signup error details:', err);
      setErrorMsg('User registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row mt-5">
      <h1 className="col-6 offset-3">SignUp</h1>
      <div className="col-6 offset-3">
        {errorMsg && (
          <div className="alert alert-danger" role="alert">
            {errorMsg}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className={`needs-validation ${validated ? 'was-validated' : ''}`}
          noValidate
        >
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Please enter a username.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Please enter a valid email.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Please enter a password.</div>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-success">
            {submitting ? 'Signing up...' : 'SignUp'}
          </button>
        </form>
      </div>
    </div>
  );
}
