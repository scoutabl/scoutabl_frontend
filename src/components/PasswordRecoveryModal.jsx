import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'
import OtpInput from '@/components/OtpInput';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import logo from '/logo.svg'
import helpIcon from '/helpIcon.svg'
import { Button } from '@/components/ui/button';
import { BASE_API_URL } from '@/lib/constants';

const emailSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" }).max(50, { message: "Email is too long" })
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Invalid email address" })
        .email({ message: "Email is required" }),
});

const passwordSchema = z.object({
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const PasswordRecoveryModal = () => {
    const [step, setStep] = useState('email'); // email, otp, new-password, success
    const [emailVerificationId, setEmailVerificationId] = useState(null);
    const [email, setEmail] = useState('');
    const [otpValue, setOtpValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const emailForm = useForm({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        }
    });

    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        }
    });

    // Reset state when modal is closed
    const handleOpenChange = (open) => {
        if (!open) {
            setStep('email');
            setErrorMessage('');
            setOtpValue('');
            emailForm.reset();
            passwordForm.reset();
        }
        setIsOpen(open);
    };

    const onSubmitEmail = async (values) => {
        try {
            setErrorMessage('');
            const response = await fetch(`${BASE_API_URL}/users/forgot_password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email
                }),
                credentials: 'include'
            });

            // Check if response is not ok (HTTP error)
            if (!response.ok) {
                // Try to parse error as JSON first
                try {
                    const errorData = await response.json();
                    console.error('Forgot password error response:', errorData);
                    throw new Error(errorData.detail || 'Forgot Password Failed');
                } catch (jsonError) {
                    // If not valid JSON, use status text
                    throw new Error(`Failed to reset password: ${response.statusText}`);
                }
            }

            // If we reach here, the response was successful and should be JSON
            const data = await response.json();
            setEmailVerificationId(data.email_verification);
            setEmail(values.email);
            setStep('otp');
        } catch (error) {
            console.error('Forgot password error:', error);
            setErrorMessage(error.message || 'Failed to send verification code');
            return false;
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpValue || otpValue.length !== 6) {
            setErrorMessage('Please enter a valid 6-digit code');
            return;
        }

        try {
            setErrorMessage('');
            const response = await fetch(`${BASE_API_URL}/reset-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: emailVerificationId,
                    token: otpValue,
                    verify_only: true
                }),
                credentials: 'include'
            });

            // Check if response is not ok (HTTP error)
            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Invalid verification code');
                } catch (jsonError) {
                    throw new Error(`Verification failed: ${response.statusText}`);
                }
            }

            // If verification successful, move to password reset step
            setStep('new-password');
        } catch (error) {
            console.error('OTP verification error:', error);
            setErrorMessage(error.message || 'Failed to verify code');
        }
    };

    const onSubmitNewPassword = async (values) => {
        try {
            setErrorMessage('');
            const response = await fetch(`${BASE_API_URL}/reset-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: emailVerificationId,
                    token: otpValue,
                    new_password: values.password,
                    verify_only: false
                }),
                credentials: 'include'
            });

            // Check if response is not ok (HTTP error)
            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to reset password');
                } catch (jsonError) {
                    throw new Error(`Password reset failed: ${response.statusText}`);
                }
            }

            // If password reset successful, move to success step
            setStep('success');
        } catch (error) {
            console.error('Password reset error:', error);
            setErrorMessage(error.message || 'Failed to reset password');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <span className='text-primarytext text-xs font-medium cursor-pointer'>Forgot Password?</span>
            </DialogTrigger>
            <DialogContent className="rounded-[40px] p-6">
                <DialogHeader>
                    <DialogDescription className='flex items-center justify-between'>
                        <span className='text-[#333333] font-normal text-xl'>
                            Recover your <span className='bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text'>Scoutabl Account</span>
                        </span>
                        <span className='flex items-center gap-2'>
                            <img src={helpIcon} alt="help icon" className='h-[14px] w-[14px]' />
                            <span className='font-medium text-base text-[#454545]'>Help</span>
                        </span>
                    </DialogDescription>
                    <DialogTitle className='font-semibold text-[2.5rem] text-[#333333]'>Password Recovery</DialogTitle>
                    <figure className='w-full flex items-center justify-center'>
                        <img src={logo} alt="scoutabl logo" className='h-24 w-24' />
                    </figure>
                </DialogHeader>

                {/* Error message display */}
                {errorMessage && (
                    <div className="p-3 text-red-500 bg-red-100 rounded-md text-sm mb-4">
                        {errorMessage}
                    </div>
                )}

                <AnimatePresence mode='wait'>
                    {step === 'email' && (
                        <motion.div
                            key='email'
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.3 }}
                            className="grid gap-4 py-4">
                            <div>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    emailForm.handleSubmit(onSubmitEmail)(e);
                                }} className="flex flex-col gap-9">
                                    <div className='flex flex-col gap-4'>
                                        <Label htmlFor="email" className="text-right">
                                            Enter your email address
                                        </Label>
                                        <Input
                                            {...emailForm.register("email")}
                                            id="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            className="col-span-3"
                                        />
                                        {emailForm.formState.errors.email && (
                                            <span className='text-red-500 text-sm font-medium'>{emailForm.formState.errors.email.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col items-center justify-center gap-9'>
                                        <Button type="submit" className='bg-gradient-custom h-[54px] w-[296px] rounded-[20px] [box-shadow:0px_0px_4px_rgba(0,_0,_0,_0.25)] hover:opacity-90'>
                                            Send Code
                                        </Button>
                                        <DialogClose asChild>
                                            <Button className='flex items-center justify-center gap-2 bg-black rounded-[12px] h-10 w-[129px]'>
                                                <ChevronLeft />
                                                <span className='text-white font-semibold text-sm'>Back</span>
                                            </Button>
                                        </DialogClose>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {step === 'otp' && (
                        <motion.div
                            key="otp"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <span className="text-black text-lg font-medium">
                                Code sent to <span className="text-secondarytext font-medium">{email}</span>
                            </span>
                            <OtpInput onOtpSubmit={setOtpValue} onChange={setOtpValue} />
                            <div className='flex flex-col items-center justify-center gap-9'>
                                <Button onClick={handleVerifyOtp} className='bg-gradient-custom h-[54px] w-[296px] rounded-[20px] [box-shadow:0px_0px_4px_rgba(0,_0,_0,_0.25)] hover:opacity-90'>
                                    Verify
                                </Button>
                                <Button onClick={() => setStep('email')} className='flex items-center justify-center gap-2 bg-black rounded-[12px] h-10 w-[129px]'>
                                    <ChevronLeft />
                                    <span className='text-white font-semibold text-sm'>Back</span>
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'new-password' && (
                        <motion.div
                            key="new-password"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-6"
                        >
                            <span className="text-black text-lg font-medium text-center">
                                Create a new password
                            </span>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                passwordForm.handleSubmit(onSubmitNewPassword)(e);
                            }} className="flex flex-col gap-6">
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            {...passwordForm.register("password")}
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {passwordForm.formState.errors.password && (
                                        <span className='text-red-500 text-sm font-medium'>{passwordForm.formState.errors.password.message}</span>
                                    )}
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            {...passwordForm.register("confirmPassword")}
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(prev => !prev)}
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {passwordForm.formState.errors.confirmPassword && (
                                        <span className='text-red-500 text-sm font-medium'>{passwordForm.formState.errors.confirmPassword.message}</span>
                                    )}
                                </div>

                                <div className='flex flex-col items-center justify-center gap-9 mt-2'>
                                    <Button type="submit" className='bg-gradient-custom h-[54px] w-[296px] rounded-[20px] [box-shadow:0px_0px_4px_rgba(0,_0,_0,_0.25)] hover:opacity-90'>
                                        Reset Password
                                    </Button>
                                    <Button onClick={() => setStep('otp')} className='flex items-center justify-center gap-2 bg-black rounded-[12px] h-10 w-[129px]'>
                                        <ChevronLeft />
                                        <span className='text-white font-semibold text-sm'>Back</span>
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-6 py-4"
                        >
                            <div className="bg-green-100 p-4 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-center">Password Reset Successful!</h3>
                            <p className="text-center text-gray-600">Your password has been reset successfully. You can now log in with your new password.</p>
                            <DialogClose asChild>
                                <Button className='bg-gradient-custom h-[54px] w-[296px] rounded-[20px] [box-shadow:0px_0px_4px_rgba(0,_0,_0,_0.25)] hover:opacity-90 mt-2'>
                                    Back to Login
                                </Button>
                            </DialogClose>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent >
        </Dialog >
    )
}

export default PasswordRecoveryModal