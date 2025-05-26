import backgroundImage from '/loginBg.svg'
import backgroundImageSmall from '/loginBg-small.svg'
import logo from '/logo.svg'
import { useEffect, useState } from 'react'

const GradientBackground = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="hidden md:block fixed top-0 left-0 w-1/2 h-screen overflow-hidden bg-white">
            <div className="absolute inset-0">
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        src={windowWidth > 1080 ? backgroundImage : backgroundImageSmall}
                        alt="Gradient Background"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 grid place-content-center w-[200px] h-[200px] bg-[rgba(255,_255,_255,_0.3)] border border-[#EFE3E3] [box-shadow:0px_4px_4px_rgba(0,_0,_0,_0.25),_0px_8px_20px_rgba(0,_0,_0,_0.1)] rounded-[60px] backdrop-blur-sm responsive-height">
                <img src={logo} alt="Scoutabl Logo" className="h-24 w-24" />
            </div>
        </div>
    );
};

export default GradientBackground; 