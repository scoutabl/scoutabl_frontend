import React from 'react';
import rectangle1 from '/rectangle1.svg'
import rectangle2 from '/rectangle2.svg'
import rectangle3 from '/rectangle3.svg'
import gradientLogo from '/gradientLogo.svg'
const GradientBackground = () => {
    return (
        <div className='relative w-2/3'>
            <div className='absolute inset-0 overflow-hidden'>

                <img src={gradientLogo} alt="" className='absolute left-[50px] top-[40%] h-[200px] w-[200px] z-10' />
                <img src={rectangle3} alt="" className='absolute left-0 h-full w-[100%]' />
                <img src={rectangle2} alt="" className='absolute left-0 h-full w-[75%]' />
                <img src={rectangle1} alt="" className='absolute left-0 h-full w-[50%]' />
            </div>
        </div>
    );
};

export default GradientBackground; 