import React from 'react';
import BG_IMG from '../../assets/images/bg-img.avif'; // ✅ Correct import path

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Left side for content */}
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-[35px] font-medium text-black font-weight-700">Task Manager</h2>
        {children}
      </div>

      {/* Right side with background image */}
      <div
        className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-cover bg-no-repeat bg-center overflow-hidden p-8"
        style={{ backgroundImage: `url(${BG_IMG})` }}
      >
        {/* You can optionally add overlay content here */}
      </div>
    </div>
  );
};

export default AuthLayout;
