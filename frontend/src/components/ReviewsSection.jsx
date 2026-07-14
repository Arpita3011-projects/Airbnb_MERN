import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ReviewsSection({ listingId, reviews, onReviewAddedOrDeleted, user }) {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');
  const [formValidated, setFormValidated] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormValidated(true);

    // Lightweight validation (matches backend Joi): rating 1-5, comment required
    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      setFormError('Please enter a comment.');
      return;
    }
    if (Number.isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      setFormError('Please select a rating from 1 to 5.');
      return;
    }

    setSubmittingReview(true);
    try {
      // Backend expects: req.body.review = { rating, comment }
      // The body parser on Express backend requires urlencoded payload or JSON if supported.
      // Wait, let's verify if Express backend has urlencoded parser. Yes!
      // Does it support JSON body parser? We checked app.js, it DOES NOT use app.use(express.json())!
      // This means we MUST submit the review as urlencoded form data, just like login/signup!
      // This is an extremely critical detail! If we send JSON, req.body.review will be undefined on backend.
      const params = new URLSearchParams();
      // Backend middleware expects Joi on req.body.review (rating/comment)
      // Express.urlencoded cannot parse nested keys reliably in all setups,
      // so send the flattened values that we map to req.body.review.
      params.append("review[rating]", rating);
      params.append("review[comment]", comment);



      await api.post(`/listings/${listingId}/reviews`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      e.target.reset();
setComment('');
setRating(1);
setFormValidated(false);
setFormError('');
      setRating(1);
      if (onReviewAddedOrDeleted) {
        onReviewAddedOrDeleted();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setFormError('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/listings/${listingId}/reviews/${reviewId}`);
        if (onReviewAddedOrDeleted) {
          onReviewAddedOrDeleted();
        }
      } catch (err) {
        console.error('Error deleting review:', err);
        alert('Failed to delete review.');
      }
    }
  };

  return (
    <div className="card col-6 offset-3 show-card">
      {user ? (
        <div>
          <h4>Leave a Review</h4>
          <br />
          <form
            className={`mb-3 needs-validation ${formValidated ? 'was-validated' : ''}`}
            onSubmit={handleReviewSubmit}
            noValidate
          >
            <fieldset className="starability-slot">
              <input
                type="radio"
                id="no-rate"
                className="input-no-rate"
                name="review[rating]"
                value="0"
                checked={rating === 0}
                onChange={() => setRating(0)}
                aria-label="No rating."
              />
              <input
                type="radio"
                id="first-rate1"
                name="review[rating]"
                value="1"
                checked={rating === 1}
                onChange={() => setRating(1)}
              />
              <label htmlFor="first-rate1">1 star</label>

              <input
                type="radio"
                id="first-rate2"
                name="review[rating]"
                value="2"
                checked={rating === 2}
                onChange={() => setRating(2)}
              />
              <label htmlFor="first-rate2">2 stars</label>

              <input
                type="radio"
                id="first-rate3"
                name="review[rating]"
                value="3"
                checked={rating === 3}
                onChange={() => setRating(3)}
              />
              <label htmlFor="first-rate3">3 stars</label>

              <input
                type="radio"
                id="first-rate4"
                name="review[rating]"
                value="4"
                checked={rating === 4}
                onChange={() => setRating(4)}
              />
              <label htmlFor="first-rate4">4 stars</label>

              <input
                type="radio"
                id="first-rate5"
                name="review[rating]"
                value="5"
                checked={rating === 5}
                onChange={() => setRating(5)}
              />
              <label htmlFor="first-rate5">5 stars</label>
            </fieldset>

            <div className="mb-3 mt-2">
              <label htmlFor="comment" className="form-label">
                Comment
              </label>
              <textarea
                id="comment"
                name="review[comment]"
                rows="5"
                className="form-control"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
              {formError && <div className="text-danger mt-1">{formError}</div>}
            </div>
            <button type="submit" disabled={submittingReview} className="btn btn-outline-dark">
              {submittingReview ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      ) : (
        <p>
          Please <Link to="/login">login</Link> to leave a review.
        </p>
      )}

      <h4>Reviews</h4>
      <hr />
      {reviews && reviews.length > 0 ? (
        <div className="row">
          {reviews.map((review) => {
            const isReviewAuthor =
              user &&
              review.author &&
              (review.author._id === user._id || review.author === user._id);

            return (
              <div className="card col-5 ms-3 mb-3 p-3" key={review._id}>
                <div className="card-body">
                  <h5 className="card-title">@{review.author?.username || 'Unknown'}</h5>
                  <p className="starability-result" data-rating={review.rating}>
                    Rated: {review.rating} stars
                  </p>
                  <p className="card-text">{review.comment}</p>
                </div>
                {isReviewAuthor && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="btn btn-sm btn-dark mt-3 align-self-start"
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-2">No reviews yet.</p>
      )}
    </div>
  );
}
