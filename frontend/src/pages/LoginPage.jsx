import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {

  const [username, setUsername] = useState('');
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
      // Send credentials as application/x-www-form-urlencoded to mimic EJS form submission if needed,
      // or standard JSON (Passport local strategy by default supports JSON body parsers in Express).
      // Express app has: app.use(express.urlencoded({ extended: true }));
      // Wait, let's see if Express parses JSON. It doesn't have app.use(express.json())!
      // Ah! Let's check app.js:
      // Line 71: app.use(express.urlencoded({ extended: true }));
      // There is NO app.use(express.json()) in app.js!
      // This is an extremely critical detail! If we send JSON, req.body will be empty on the backend!
      // So we MUST send it as urlencoded form data!
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await api.post('/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // If backend responds with redirectUrl JSON, follow it. Otherwise fallback to /listings.
      const redirectUrl = response.data?.redirectUrl;
      if (redirectUrl) {
        await login();
        navigate(redirectUrl);
        return;
      }

      await login();
      navigate('/listings');
    } catch (err) {
      console.error('Login error details:', err);
      // Backend usually redirects on failure; Axios may surface that as an error.
      const msg = err?.response?.data?.message || err?.message || 'Invalid username or password.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row mt-5">
      <h1 className="col-6 offset-3">Login</h1>
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
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
