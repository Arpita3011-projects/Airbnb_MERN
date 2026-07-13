import ReviewsSection from './components/ReviewsSection';

// Global entry used by EJS.
// EJS calls: window.ReviewsSectionApp.render({ root, listingId, reviews, user, onReviewAddedOrDeleted })
// NOTE: This file intentionally avoids JSX so Vite can build even without JSX parser config.
window.ReviewsSectionApp = {
  render: ({ root, listingId, reviews, user, onReviewAddedOrDeleted }) => {
    if (!root) return;

    const { createRoot } = require('react-dom/client');
    const React = require('react');

    const rootInstance = createRoot(root);
    rootInstance.render(
      React.createElement(ReviewsSection, {
        listingId,
        reviews,
        user,
        onReviewAddedOrDeleted,
      })
    );
  },
};


