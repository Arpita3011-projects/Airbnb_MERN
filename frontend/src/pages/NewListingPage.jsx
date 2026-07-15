import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function NewListingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [country, setCountry] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState(null);


  const [validated, setValidated] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreviewUrl('');
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
      
      const formData = new FormData();
      formData.append('listing[title]', title);
      formData.append('listing[description]', description);
      formData.append('listing[price]', price);
      formData.append('listing[location]', location);
      formData.append('listing[country]', country);

      if (imageFile) {
        formData.append('listing[image]', imageFile);
      }

      const response = await api.post('/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      
      const finalUrl = response.request.responseURL || '';
      if (finalUrl.includes('/listings')) {
        navigate('/listings');
      } else {
        setErrorMsg('Failed to create listing. Please double check the inputs.');
      }
    } catch (err) {
      console.error('Error creating new listing:', err);
      setErrorMsg('Failed to create listing. Please ensure you are logged in and all fields are valid.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row">
      <div className="col-8 offset-2">
        <div className="container mt-2">
          <br />
          <h3>Create a New Listing</h3>
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
                placeholder="enter title"
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
                placeholder="enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
              <div className="valid-feedback">Looks good!</div>
              <div className="invalid-feedback">Please Enter a description.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Upload Image
              </label>
              <input
                id="image"
                type="file"
                name="listing[image]"
                className="form-control"
                onChange={handleImageChange}
              />
              {imagePreviewUrl && (
                <div className="mt-3">
                  <p>Image Preview</p>
                  <img
                    src={imagePreviewUrl}
                    style={{ maxHeight: '150px', width: 'auto' }}
                    className="img-thumbnail"
                    alt="preview"
                  />
                </div>
              )}
            </div>

            <div className="row">
              <div className="mb-3 col-md-4">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  id="price"
                  name="listing[price]"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="enter price"
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
                  placeholder="enter country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
                <div className="invalid-feedback">Please choose a country.</div>
                <div className="valid-feedback">Looks good!</div>
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
                placeholder="enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <div className="invalid-feedback">Please choose a valid location.</div>
              <div className="valid-feedback">Looks good!</div>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-dark add-btn mb-3">
              {submitting ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
