
import backgroundImage from '/loginBg.svg'
import logo from '/logo.svg'
const GradientBackground = () => {
    return (
        <div className="relative w-full md:w-1/2">
            <img
                src={backgroundImage}
                alt="Gradient Background"
                className="w-full h-auto md:h-screen object-cover"
            />
            <div className='absolute top-1/3 left-[12%] grid place-content-center w-[200px] h-[200px] bg-[rgba(255,_255,_255,_0.3)] border border-[#EFE3E3] [box-shadow:0px_4px_4px_rgba(0,_0,_0,_0.25),_0px_8px_20px_rgba(0,_0,_0,_0.1)] rounded-[60px]'><img src={logo} alt="" className='h-24 w-24' /></div>
        </div>
    );
};

export default GradientBackground; 