import React from 'react';
import ReviewsSection from './ReviewsSection';

// Small wrapper that exposes a mountable API for non-React (EJS) pages.
// The build step will expose `window.ReviewsSectionApp.render(props)`.
export function ReviewsSectionApp({ root, ...props }) {
  return <ReviewsSection {...props} />;
}

// UMD-ish global entrypoint (used by EJS). During build we’ll re-export this.
export function render(props) {
  const { root } = props;
  if (!root) return;
  // React 19: use createRoot inside wrapper to avoid importing react-dom in EJS.
  // The bundler will include it.
  const { createRoot } = require('react-dom/client');
  const rootInstance = createRoot(root);
  rootInstance.render(React.createElement(ReviewsSectionApp, props));
}

// default export for convenience (not required)
export default { render };

