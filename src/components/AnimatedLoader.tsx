import React from 'react';

const AnimatedLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Open Book Icon */}
        <div className="w-16 h-16 text-orange-500 animate-pulse">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/61/Book-icon-orange.png" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          </img>
        </div>
        
        {/* Animated Bouncing Dots */}
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-8 h-8 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-8 h-8 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
        
        <p className="text-black text-2xl font-semibold font-sans">
          Loading EduIndia...
        </p>
      </div>
    </div>
  );
};

export default AnimatedLoader;
