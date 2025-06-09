import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import { set, useForm } from 'react-hook-form'
import { z } from 'zod'
import backgroundImage from '/loginBg.svg'
import googleIcon from '/googleIcon.svg'
import micorosoftIcon from '/microsoftIcon.svg'
import helpIcon from '/helpIcon.svg'
import logo from '/logo.svg'
import OtpInput from '@/components/OtpInput';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GradientBackground from '@/components/GradientBackground';
import { ChevronRight, MessageSquareWarning, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogClose } from '@/components/ui/dialog';
import { ChevronLeft } from 'lucide-react';
import { toast } from "sonner"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const SignupPage = () => {
    const [apiError, setApiError] = useState("")
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [emailVerificationId, setEmailVerificationId] = useState('')
    const [accessToken, setAccessToken] = useState('')
    const [cooldownActive, setCooldownActive] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [userPassword, setUserPassword] = useState("");

    // Reset isVerified state on component mount
    useEffect(() => {
        setIsVerified(false);
    }, []);

    // Cooldown timer effect
    useEffect(() => {
        let interval;
        if (cooldownActive && cooldownTime > 0) {
            interval = setInterval(() => {
                setCooldownTime((prev) => prev - 1);
            }, 1000);
        } else if (cooldownTime === 0) {
            setCooldownActive(false);
        }
        return () => clearInterval(interval);
    }, [cooldownActive, cooldownTime]);

    // Format remaining time as MM:SS
    const formatRemainingTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const formSchema = z.object({
        fullName: z.string().min(1, { message: "Full Name is required" }),
        email: z.string().email({ message: "Email is required" }),
        password: z.string().min(8, { message: "Password is required" }),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        }
    })

    // Function to reset all states
    const resetStates = () => {
        setApiError("");
        setEmail("");
        setOtpValue("");
        setEmailVerificationId("");
        setAccessToken("");
        setCooldownActive(false);
        setCooldownTime(0);
    };

    async function onSubmit(values) {
        setIsLoading(true);
        const [first_name, ...rest] = values.fullName.trim().split(' ');
        const last_name = rest.join(' ');
        const username = values.email
        setEmail(values.email)
        setUserPassword(values.password)
        const payload = {
            first_name: first_name,
            last_name: last_name,
            username: username,
            email: values.email,
            password: values.password,

        }
        try {
            const response = await fetch("https://dev.scoutabl.com/api/users/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.username || errorData.email);
                const errorMsg = errorData.email?.[0] || errorData.username?.[0] || "Registration Failed";
                // alert("Registration Failed!")
                setApiError(errorMsg);
                return;
            }

            const data = await response.json();
            setEmailVerificationId(data.email_verification);
            setAccessToken(data.tokens.access);
            setIsVerified(false); // Ensure isVerified is false when opening the dialog
            setOpen(true);
            // Set initial cooldown when modal is first opened
            setCooldownTime(120); // 2 minutes
            setCooldownActive(true);

        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred during registration.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleOtpSubmit = async (otp) => {
        if (!emailVerificationId || !otp) {
            setApiError("Missing user ID or OTP");
            return;
        }
        try {
            const response = await fetch("https://dev.scoutabl.com/api/verify-email/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: emailVerificationId,
                    token: otp
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                console.error("Error:", data);
                setApiError(data.token?.[0] || data.error || "Verification failed");
                return;
            }
            // Success logic here
            setIsVerified(true);
            toast.success("Email verified successfully!");
        } catch (error) {
            console.error("Error:", error);
            setApiError("An error occurred during verification.");
        }
    };

    const handleResendOtp = async () => {
        if (cooldownActive) {
            toast.warning(`Please wait ${formatRemainingTime(cooldownTime)} before requesting another code.`)
            return;
        }

        try {
            const response = await fetch("https://dev.scoutabl.com/api/resend-verification-email/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    email: email,
                })
            })

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData);

                // Check if error is related to cooldown
                if (errorData.error && errorData.error.includes("within")) {
                    // Extract minutes from error message if possible
                    const timeMatch = errorData.error.match(/(\d+):(\d+):(\d+)/);
                    let cooldownSeconds = 120; // Default 2 minutes

                    if (timeMatch && timeMatch.length >= 3) {
                        const minutes = parseInt(timeMatch[1], 10);
                        const seconds = parseInt(timeMatch[2], 10);
                        cooldownSeconds = (minutes * 60) + seconds;
                    }

                    setCooldownTime(cooldownSeconds);
                    setCooldownActive(true);

                    toast.warning(`Please wait ${formatRemainingTime(cooldownSeconds)} before requesting another code.`)
                } else {
                    setApiError("Failed to resend OTP");
                }
                return;
            }

            const data = await response.json();

            // Set cooldown after successful resend
            setCooldownTime(120); // 2 minutes
            setCooldownActive(true);

            toast.success("OTP resent successfully!");
        }
        catch (error) {
            console.error("Error:", error);
            setApiError("An error occurred while resending the OTP.");
        }
    }



    return (
        <div className='min-h-screen flex'>
            <GradientBackground />
            {/* Right: Form */}
            <div className="w-full md:w-1/2 md:ml-auto flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 bg-white min-h-screen">
                <div className="w-full max-w-[342px]">
                    <h1 className='text-4xl md:text-[52px] font-bold text-greyPrimary mb-6'>
                        Welcome to Scoutabl
                    </h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-primarytext text-base font-medium'>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your name" {...field} />
                                        </FormControl>
                                        <div className="min-h-[20px] py-1">
                                            <FormMessage className="text-xs font-medium" />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-primarytext text-base font-medium'>Business Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your business email" {...field} />
                                        </FormControl>
                                        <div className="min-h-[20px] py-1">
                                            <FormMessage className="text-xs font-medium" />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            {/* <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-primarytext text-base font-medium'>Password</FormLabel>
                                        <FormControl>
                                            <Input autoComplete="on" type="password" placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs"/>
                                    </FormItem>
                                )}
                            /> */}
                            {/* Password field*/}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-primarytext text-base font-medium'>Password</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    autoComplete="current-password"
                                                    placeholder="Enter your password"
                                                    {...field}
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(prev => !prev)}
                                                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <Eye className="h-5 w-5" color='black' />

                                                ) : (
                                                    <EyeOff className="h-5 w-5" color='black' />
                                                )}
                                            </button>
                                        </div>
                                        <div className="min-h-[20px] py-1">
                                            <FormMessage className="text-xs font-medium" />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <div className='w-full flex items-center justify-center'>
                                <Button className='bg-gradient-custom [box-shadow:0px_4px_4px_rgba(0,_0,_0,_0.25)] rounded-[12px] flex items-center justify-center gap-2' type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            Take the first step
                                            <ChevronRight />
                                        </>
                                    )}
                                </Button>
                            </div>

                            {apiError &&
                                <div className='w-full flex items-center justify-center gap-2 border border-black bg-red-400 rounded-md py-2 shadow-lg'>
                                    <MessageSquareWarning />
                                    <p className='text-black text-center'>{apiError}</p>
                                </div>
                            }
                        </form>
                        <div className='py-[22px] flex items-center justify-center gap-4 whitespace-nowrap'>
                            <div className='h-px bg-[#CFDFE2] flex-1'></div>
                            <p className='text-primarytext text-sm font-normal'>Or Sign in with</p>
                            <div className='h-px bg-[#CFDFE2] flex-1'></div>
                        </div>
                        <div className='flex items-center justify-center gap-5'>
                            <a href="https://dev.scoutabl.com/auth/login/azuread-tenant-oauth2/">
                                <img src={micorosoftIcon} alt="Microsoft" className='w-[29.24px] h-[29.24px]' />
                            </a>
                            <a href="https://dev.scoutabl.com/auth/login/google-oauth2/">
                                <img src={googleIcon} alt="Google" className='w-[29.24px] h-[29.24px]' />
                            </a>
                        </div>
                        <span className='pt-6 block text-center'>Already have an account? <a href="/login" className='text-secondarytext'>Sign in here</a></span>
                    </Form>
                </div>
            </div>

            <Dialog
                open={open}
                onOpenChange={(openState) => {
                    setOpen(openState);
                    if (!openState) {
                        // Reset states when dialog is closed
                        setCooldownActive(false);
                        setCooldownTime(0);
                        if (!isVerified) {
                            setOtpValue('');
                        } else {
                            // If the dialog is closed after verification, reset all states
                            resetStates();
                            setIsVerified(false);
                        }
                    }
                }}
            >
                <DialogContent className="sm:max-w-[549px] rounded-[40px] px-12 py-6 max-h-[686px]">
                    <DialogHeader >
                        <DialogDescription className='flex items-center justify-between'>
                            <span className='text-[#333333] font-normal text-xl'>
                                Welcome to <span className='bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text'>Scoutabl</span>
                            </span>
                            <span className='flex items-center gap-2'>
                                <img src={helpIcon} alt="help icon" className='h-[14px] w-[14px]' />
                                <span className='font-medium text-base text-[#454545]'>Help</span>
                            </span>
                        </DialogDescription>
                        {isVerified
                            ?
                            <div className='flex flex-col items-center justify-center gap-6 max-w-'>
                                <DialogTitle className='font-semibold text-[2.5rem] text-[#333333] mt-2'>Account Created</DialogTitle>
                                <figure className='w-full flex items-center justify-center py-5'>
                                    <img src={logo} alt="scoutabl logo" className='h-28 w-28' />
                                </figure>
                                <span className="text-greyPrimary text-lg font-light text-center">
                                    You just took your first step to better hiring.
                                </span>
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <a href="/organization-setup" className='bg-gradient-custom h-[54px] w-[296px] rounded-[20px] [box-shadow:0px_0px_4px_rgba(0,_0,_0,_0.25)] hover:opacity-90 flex items-center justify-center'>Setup your Account</a>
                                    <span className='text-greyPrimary font-normal text-sm cursor-pointer' onClick={async () => { await login(email, userPassword, true); navigate('/'); }}>Be lazy &amp; <span className='text-bluePrimary hover:underline underline-offset-2'>Skip for Now!</span></span>
                                </div>
                            </div>
                            :
                            <>
                                <DialogTitle className='font-semibold text-[2.5rem] text-[#333333]'>Email Verification</DialogTitle>
                                <figure className='w-full flex items-center justify-center py-5'>
                                    <img src={logo} alt="scoutabl logo" />
                                </figure>
                                <span className="text-black text-lg font-medium text-center">
                                    Code sent to <span className="text-secondarytext font-medium">{email}</span>
                                </span>
                                <OtpInput onOtpSubmit={handleOtpSubmit} onChange={setOtpValue} />
                                <div className='flex flex-col items-center justify-center gap-4'>
                                    <Button onClick={() => handleOtpSubmit(otpValue)} className='bg-gradient-custom h-[54px] w-[296px] rounded-[20px] [box-shadow:0px_0px_4px_rgba(0,_0,_0,_0.25)] hover:opacity-90'>Verify</Button>
                                    <span className='block text-center'>Didn&apos;t get the code?{" "}
                                        <button
                                            onClick={handleResendOtp}
                                            className={`${cooldownActive ? 'text-gray-400' : 'text-secondarytext'}`}
                                        >
                                            {cooldownActive
                                                ? `Resend in ${formatRemainingTime(cooldownTime)}`
                                                : 'Resend it'}
                                        </button>
                                    </span>
                                    <Button onClick={() => setOpen(false)} className='flex items-center justify-center gap-2 bg-black rouned-[12px] h-10 w-[129px] mt-2'>
                                        <ChevronLeft />
                                        <span className='text-white font-semibold text-sm'>Back</span>
                                    </Button>
                                </div>
                            </>
                        }
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SignupPage; 