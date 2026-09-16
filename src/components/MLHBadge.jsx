import React from 'react';

const MLHBadge = () => {
  return (
    <a
      id="mlh-trust-badge"
      className="block fixed top-0 right-2 w-10 min-w-[40px] max-w-[56px] md:right-[50px] md:w-[10%] md:min-w-[60px] md:max-w-[100px] z-[10000]"
      href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=white"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://logged-assets.s3.amazonaws.com/trust-badge/2027/mlh-trust-badge-2027-white.svg"
        alt="Major League Hacking 2026 Hackathon Season"
        style={{ width: '100%' }}
      />
    </a>
  );
};

export default MLHBadge;