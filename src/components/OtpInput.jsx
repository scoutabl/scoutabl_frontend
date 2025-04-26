import { useState, useRef, useEffect } from 'react';

const OtpInput = ({ length = 6, onOtpSubmit = () => { }, onChange = () => { } }) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef([]);

    const handleChange = (index, event) => {
        const value = event.target.value;
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Notify parent of change, but don't submit
        const combinedOtp = newOtp.join('');
        onChange(combinedOtp);

        //Move to next input if current is filled
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }

        //move to last field if current is empty and next is filled
        if (!value && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Move focus to the previous input if current input is empty and backspace is pressed
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleClick = (index) => {
        inputRefs.current[index].setSelectionRange(1, 1)

        if (index > 0 && !otp[index - 1]) {
            // Move focus to the previous input if current input is empty and clicked
            inputRefs.current[otp.indexOf('')].focus()
        }
    }

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    return (
        <div className='mb-[26px] self-center'>
            {otp.map((value, index) => (
                <input
                    autoComplete='one-time-code'
                    inputMode='numeric'
                    type="text"
                    className="mx-2 w-[40px] h-[68px] border-b-2 border-[#5C5C5C] text-center text-[64px] font-bold focus:outline-none focus:border-b-purple-500 text-[#5C5C5C]"
                    key={index}
                    ref={(input) => (inputRefs.current[index] = input)}
                    value={value}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onClick={() => handleClick(index)}
                    maxLength={1}
                />
            ))}
        </div>
    );
};

export default OtpInput;
