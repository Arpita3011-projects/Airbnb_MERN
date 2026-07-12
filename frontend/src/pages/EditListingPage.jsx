import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form Field States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [country, setCountry] = useState('');
  const [location, setLocation] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // UX states
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [validated, setValidated] = useState(false);
  const [newImagePreviewUrl, setNewImagePreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        const data = response.data.listing || response.data;
        if (data) {
          setTitle(data.title || '');
          setDescription(data.description || '');
          setPrice(data.price || '');
          setCountry(data.country || '');
          setLocation(data.location || '');
          const imgUrl = data.image && data.image.url ? data.image.url : data.image;
          setCurrentImageUrl(imgUrl || '');
        }
      } catch (err) {
        console.error('Error fetching listing data for editing:', err);
        setErrorMsg('Failed to load listing details for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchListingData();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setNewImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setNewImagePreviewUrl('');
    }
  };

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
      // Must use FormData since we are doing a multipart/form-data file upload (Multer)
      const formData = new FormData();
      formData.append('listing[title]', title);
      formData.append('listing[description]', description.trim());
      formData.append('listing[price]', price);
      formData.append('listing[location]', location);
      formData.append('listing[country]', country);

      if (imageFile) {
        formData.append('listing[image]', imageFile);
      }

      const response = await api.put(`/listings/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Axios follows the redirect. Inspect response URL to verify redirection to show page
      const finalUrl = response.request.responseURL || '';
      if (finalUrl.includes(`/listings`)) {
        navigate(`/listings/${id}`);
      } else {
        setErrorMsg('Failed to update listing. Please double check the inputs.');
      }
    } catch (err) {
      console.error('Error updating listing:', err);
      setErrorMsg('Failed to update listing. Please ensure you are logged in and all fields are valid.');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="row">
      <div className="col-8 offset-2">
        <div className="container mt-2">
          <br />
          <h3>Edit Listings</h3>
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
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                id="title"
                name="listing[title]"
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <div className="valid-feedback">Looks good!</div>
              <div className="invalid-feedback">Please choose a title.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="listing[description]"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
              <div className="valid-feedback">Looks good!</div>
              <div className="invalid-feedback">Please Enter a description.</div>
            </div>

            <div className="mb-3">
              <p>Current Image Preview</p>
              {currentImageUrl && (
                <img
                  src={currentImageUrl}
                  style={{ maxHeight: '150px', width: 'auto' }}
                  className="img-thumbnail"
                  alt="current image"
                />
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Upload New Image
              </label>
              <input
                id="image"
                type="file"
                name="listing[image]"
                className="form-control"
                onChange={handleImageChange}
              />
              {newImagePreviewUrl && (
                <div className="mt-3">
                  <p>New Image Preview</p>
                  <img
                    src={newImagePreviewUrl}
                    style={{ maxHeight: '150px', width: 'auto' }}
                    className="img-thumbnail"
                    alt="new preview"
                  />
                </div>
              )}
            </div>

            <div className="row mt-3">
              <div className="mb-3 col-md-4">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  id="price"
                  name="listing[price]"
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Please enter a valid price.</div>
              </div>

              <div className="mb-3 col-md-8">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <input
                  id="country"
                  name="listing[country]"
                  type="text"
                  className="form-control"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">Please choose a country.</div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                id="location"
                name="listing[location]"
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <div className="valid-feedback">Looks good!</div>
              <div className="invalid-feedback">Please choose a valid location.</div>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-dark edit-btn mt-3 mb-3">
              {submitting ? 'Editing...' : 'Edit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
