import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTax, setShowTax] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get('/listings');
        // Backend returns listings in the allListings property or as direct response data
        const data = response.data.allListings || response.data;
        if (Array.isArray(data)) {
          setListings(data);
        } else {
          setListings([]);
        }
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to fetch listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const toggleTax = () => {
    setShowTax((prev) => !prev);
  };

  return (
    <div>
      <style>{`
        .filter {
          margin-top: 1rem;
          text-align: center;
          margin-right: 2rem;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        #filters {
          display: flex;
          flex-wrap: wrap;
          margin-top: 1rem;
          align-items: center;
        }
        .filter:hover {
          opacity: 1;
          cursor: pointer;
        }
        .filter p {
          font-size: 0.9rem;
          margin-bottom: 0;
        }
        .tax-toggle {
          border: 1px solid black;
          border-radius: 1rem;
          height: 3rem;
          padding: 1rem;
          margin-left: auto;
          display: flex;
          align-items: center;
        }
        @media (max-width: 992px) {
          .tax-toggle {
            margin-left: 0;
            margin-top: 1rem;
          }
        }
      `}</style>

      {/* Filters Section */}
      <div id="filters">
        <div className="filter">
          <div><i className="fa-solid fa-fire"></i></div>
          <p>Trending</p>
        </div>

        <div className="filter">
          <div><i className="fa-solid fa-bed"></i></div>
          <p>Rooms</p>
        </div>

        <div className="filter">
          <div><i className="fa-solid fa-city"></i></div>
          <p>Iconic Cities</p>
        </div>

        <div className="filter">
          <div><i className="fa-solid fa-mountain"></i></div>
          <p>Mountains</p>
        </div>

        <div className="filter">
          <div><i className="fa-brands fa-fort-awesome"></i></div>
          <p>Castles</p>
        </div>

        <div className="filter">
          <div><i className="fa-solid fa-person-swimming"></i></div>
          <p>Amazing pools</p>
        </div>

        <div className="filter">
          <div><i className="fa-solid fa-campground"></i></div>
          <p>Camping</p>
        </div>

        <div className="filter">
          <div><i className="fa-solid fa-cow"></i></div>
          <p>Farms</p>
        </div>

        <div className="filter">
          <div><i className="fa-regular fa-snowflake"></i></div>
          <p>Arctic</p>
        </div>

        <div className="filter">
          <div><i className="fa-solid fa-landmark-dome"></i></div>
          <p>Domes</p>
        </div>

        <div className="filter">
          <div><i className="fa-solid fa-sailboat"></i></div>
          <p>Boats</p>
        </div>

        <div className="tax-toggle">
          <div className="form-check-reverse form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="switchCheckDefault"
              checked={showTax}
              onChange={toggleTax}
              style={{ cursor: 'pointer' }}
            />
            <label className="form-check-label" htmlFor="switchCheckDefault" style={{ cursor: 'pointer' }}>
              Display Taxes
            </label>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger mt-3 text-center" role="alert">
          {error}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center mt-5">
          <h4>No listings found.</h4>
        </div>
      ) : (
        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-1 mt-3">
          {listings.map((listing) => (
            <Link to={`/listings/${listing._id}`} className="listing-link" key={listing._id}>
              <div className="card col listing-cards">
                <img
                  src={listing.image && listing.image.url ? listing.image.url : listing.image}
                  alt="listing image"
                  className="card-img-top"
                  style={{ height: '20rem' }}
                />
                <div className="card-img-overlay"></div>
                <div className="card-body">
                  <p className="card-text">
                    <b>{listing.title}</b>
                    <br />
                    &#8377;{listing.price ? listing.price.toLocaleString('en-IN') : 0} / night
                    {showTax && (
                      <span className="taxinfo" style={{ display: 'inline', fontWeight: 'normal' }}>
                        &nbsp; &nbsp; +18% GST
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
