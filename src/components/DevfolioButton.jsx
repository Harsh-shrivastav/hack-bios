import React, { useEffect } from 'react';

// Store the Devfolio slug in a configuration variable so it can be updated easily later
export const DEVFOLIO_HACKATHON_SLUG = 'YOUR-HACKATHON-SLUG';

const DevfolioButton = () => {
  useEffect(() => {
    // Dynamically load the Devfolio SDK script
    const script = document.createElement('script');
    script.src = 'https://apply.devfolio.co/v2/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div 
        className="apply-button" 
        data-hackathon-slug={DEVFOLIO_HACKATHON_SLUG} 
        data-button-theme="dark"
        style={{ height: '44px', width: '312px' }}
      />
    </div>
  );
};

export default DevfolioButton;
