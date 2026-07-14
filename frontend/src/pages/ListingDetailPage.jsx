import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ReviewsSection from '../components/ReviewsSection';


export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map elements
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);


  const fetchListing = async () => {
    try {


      const response = await api.get(`/listings/${id}`);

      const data = response.data.listing || response.data;
      setListing(data);
    } catch (err) {
      console.error('Error fetching listing details:', err);
      setError('Listing not found or failed to load listing details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  // Leaflet map initialization
  useEffect(() => {
    if (loading || !listing) return;

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      const coords =
        listing.geometry &&
        Array.isArray(listing.geometry.coordinates) &&
        listing.geometry.coordinates.length === 2
          ? listing.geometry.coordinates
          : [77.209, 28.6139]; // Default to New Delhi [lon, lat]

      const lat = coords[1];
      const lon = coords[0];

      if (window.L) {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        const map = window.L.map(mapContainerRef.current).setView([lat, lon], 11);
        mapInstanceRef.current = map;

        window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const marker = window.L.marker([lat, lon]).addTo(map);
        marker
          .bindPopup(`<h4>${listing.title || 'Listing'}</h4><p>Exact location provided after booking</p>`)
          .openPopup();

        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      } else {
        console.error('Leaflet is not loaded on window.');
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, listing]);

  const handleDeleteListing = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await api.delete(`/listings/${id}`);
        navigate('/listings');
      } catch (err) {
        console.error('Error deleting listing:', err);
        alert('Failed to delete the listing.');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="alert alert-danger mt-5 text-center" role="alert">
        {error || 'Listing not found.'}
      </div>
    );
  }

  const isOwner = (() => {
    if (!user || !listing?.owner) return false;

    // Normalize all possible forms into strings for comparison.
    const currentUserId = user?._id || user?.id;
    const ownerId = listing.owner?._id || listing.owner?.id || listing.owner;

    if (!currentUserId || !ownerId) return false;
    return String(ownerId) === String(currentUserId);
  })();

  return (
    <div className="row mt-3">
      <div className="col-8 offset-2">
        <h1>{listing.title}</h1>
      </div>

      <div className="card col-6 offset-3 show-card listing-cards mb-1">
        <img
          src={listing.image && listing.image.url ? listing.image.url : listing.image}
          className="card-img-top show-img"
          alt="listing_image"
          style={{ height: '30vh', objectFit: 'cover', borderRadius: '1rem' }}
        />
        <div className="card-body mt-3">
          {listing.owner && (
            <p className="card-text">
              Owned by: <b>{listing.owner.username || listing.owner.email}</b>
            </p>
          )}
          <p className="card-text">{listing.description}</p>
          <p className="card-text">&#8377;{listing.price ? listing.price.toLocaleString('en-IN') : 0}</p>
          <p className="card-text">{listing.location}</p>
          <p className="card-text">{listing.country}</p>
        </div>
      </div>

      {isOwner && (
        <div className="btns col-6 offset-3 d-flex gap-3 my-3">
          <Link to={`/listings/${listing._id}/edit`} className="btn btn-dark edit-btn px-4">
            Edit
          </Link>
          <button onClick={handleDeleteListing} className="btn btn-dark delete-btn px-4">
            Delete
          </button>
        </div>
      )}

      <hr className="col-6 offset-3 my-4" />

      {/* Render ReviewsSection */}
      <ReviewsSection
        listingId={listing._id}
        reviews={listing.reviews || []}
        onReviewAddedOrDeleted={fetchListing}
        user={user}
      />

      <hr className="col-6 offset-3 my-4" />

      <div className="col-12 mb-3 text-center">
        <h3>Where you'll be</h3>
        <div ref={mapContainerRef} id="map" style={{ height: '400px', width: '100%', margin: '1.5rem auto' }}></div>
      </div>
    </div>
  );
}
