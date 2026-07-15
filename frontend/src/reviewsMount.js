import ReviewsSection from './components/ReviewsSection';


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


