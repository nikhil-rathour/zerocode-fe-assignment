import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
     
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white/80 text-lg font-medium animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 