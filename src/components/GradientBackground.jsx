import React from 'react';
import rectangle1 from '/rectangle1.svg'
import rectangle2 from '/rectangle2.svg'
import rectangle3 from '/rectangle3.svg'
import gradientLogo from '/gradientLogo.svg'
import loginBg from '/loginBg.svg'
const GradientBackground = () => {
    return (
        <div className="relative col-span-8 min-h-screen max-h-screen">
            <img src={loginBg} alt="Background" className="h-full" />

            {/* Logo container */}
            {/* <div className="absolute left-16 bottom-1/4 bg-white bg-opacity-20 p-4 rounded-xl">
                <div className="text-gray-800 h-12 w-12">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" />
                        <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div> */}
        </div>
    );
};

export default GradientBackground; 