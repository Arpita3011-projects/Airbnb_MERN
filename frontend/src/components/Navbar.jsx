import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-md bg-body-light border-bottom sticky-top">
      <div className="container-fluid">
               <Link className="navbar-brand" to="/listings">
          <i className="fa-regular fa-compass" style={{ color: '#fe424d', fontSize: '2rem' }}></i>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        
          <div className="navbar-nav me-auto">
            <NavLink className="nav-link" to="/listings">
              Explore
            </NavLink>
          </div>

        
          <div className="navbar-nav ms-auto d-flex flex-column flex-md-row align-items-start align-items-md-center" style={{ gap: '6px' }}>
            <NavLink className="nav-link" to="/listings/new">
              Airbnb your home
            </NavLink>
            {!user ? (
              <>
                <NavLink className="nav-link" to="/signup">
                  <b>Sign Up</b>
                </NavLink>
                <NavLink className="nav-link" to="/login">
                  <b>Log in</b>
                </NavLink>
              </>
            ) : (
              <button
                className="nav-link btn btn-link fw-bold p-0 border-0 align-self-start align-self-md-center"
                onClick={logout}
                style={{ textDecoration: 'none', color: '#222222' }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
