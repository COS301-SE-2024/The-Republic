import React from 'react';

const LoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-bounce text-2xl">Loading...</div>
      {/* Or use an image/gif: */}
      {/* <img src="/loading.gif" alt="Loading" /> */}
    </div>
  );
};

export default LoadingIndicator;