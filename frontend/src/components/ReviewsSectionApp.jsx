import React from 'react';
import ReviewsSection from './ReviewsSection';


export function ReviewsSectionApp({ root, ...props }) {
  return <ReviewsSection {...props} />;
}


export function render(props) {
  const { root } = props;
  if (!root) return;
  
  const { createRoot } = require('react-dom/client');
  const rootInstance = createRoot(root);
  rootInstance.render(React.createElement(ReviewsSectionApp, props));
}


export default { render };

