import { useState, useRef, useEffect } from 'react';

const OtpInput = ({ length = 6, onOtpSubmit = () => { }, onChange = () => { } }) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef([]);

    const focusInput = (index) => {
        inputRefs.current[index]?.focus();
    };

    const handleChange = (index, event) => {
        const value = event.target.value;
        if (!value) {
            // If empty, clear this box
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
            onChange(newOtp.join(''));
            return;
        }

        // If user pastes or types multiple digits
        if (value.length > 1) {
            handlePaste(index, value);
            return;
        }

        // Only allow numbers
        if (!/^[0-9]$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        onChange(newOtp.join(''));

        if (index < length - 1) {
            focusInput(index + 1);
        }

        // Auto-submit if all filled
        if (newOtp.every((digit) => digit !== '')) {
            onOtpSubmit(newOtp.join(''));
        }
    };

    const handlePaste = (index, pasteValue) => {
        const digits = pasteValue.replace(/\\D/g, '').split('');
        if (digits.length === 0) return;

        const newOtp = [...otp];
        let i = index;
        digits.forEach((digit) => {
            if (i < length) {
                newOtp[i] = digit;
                i++;
            }
        });
        setOtp(newOtp);
        onChange(newOtp.join(''));

        // Focus the last filled input
        if (i <= length) {
            focusInput(i - 1);
        }

        // Auto-submit if all filled
        if (newOtp.every((digit) => digit !== '')) {
            onOtpSubmit(newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (otp[index]) {
                // Just clear this box
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
                onChange(newOtp.join(''));
            } else if (index > 0) {
                // Move focus to previous
                focusInput(index - 1);
            }
        }
    };

    const handleClick = (index) => {
        focusInput(index);
    };

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    return (
        <div className='mb-[26px] self-center flex'>
            {otp.map((value, index) => (
                <input
                    key={index}
                    ref={(input) => (inputRefs.current[index] = input)}
                    value={value}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onClick={() => handleClick(index)}
                    onPaste={(e) => {
                        e.preventDefault();
                        handlePaste(index, e.clipboardData.getData('Text'));
                    }}
                    autoComplete='one-time-code'
                    inputMode='numeric'
                    type='text'
                    className="mx-2 w-[40px] h-[68px] border-b-2 border-[#5C5C5C] text-center text-[64px] font-bold focus:outline-none focus:border-b-purple-500 text-[#5C5C5C]"
                    maxLength={1}
                    aria-label={`OTP digit ${index + 1}`}
                    tabIndex={0}
                />
            ))}
        </div>
    );
};

export default OtpInput;
