import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import { set, useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { MessageSquareWarning } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogClose } from '@/components/ui/dialog';
import { ChevronLeft } from 'lucide-react';
import { toast } from "sonner"

const SignupPage = () => {
    const [apiError, setApiError] = useState("")
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [otpValue, setOtpValue] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [emailVerificationId, setEmailVerificationId] = useState('')
    const [accessToken, setAccessToken] = useState('')
    const [cooldownActive, setCooldownActive] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);

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
        console.log(isVerified)
        const [first_name, ...rest] = values.fullName.trim().split(' ');
        const last_name = rest.join(' ');
        const username = values.email
        setEmail(values.email)
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
            // Don't close the modal immediately, show the account created screen
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
            console.log("OTP resent successfully:", data);

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
        <div className='flex min-h-screen'>
            {/* Background Section */}
            <GradientBackground />
            {/* Form Section */}
            <div className="w-1/3 flex items-center justify-center py-24">
                <div className="w-full max-w-[342px] mx-auto px-4">
                    <h1 className='pb-6 text-[3.25rem] font-bold leading-[51.9px] tracking-[-6%]'>Welcome<br /> to Scoutabl</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-primarytext text-base font-medium pb-2'>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your name" {...field} />
                                        </FormControl>
                                        <FormMessage className='py-1' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-primarytext text-base font-medium pb-2'>Business Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your business email" {...field} />
                                        </FormControl>
                                        <FormMessage className='py-1' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-primarytext text-base font-medium pb-2'>Password</FormLabel>
                                        <FormControl>
                                            <Input autoComplete="on" type="password" placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='w-full flex items-center justify-center'>
                                <Button className='bg-gradient-custom h-10 w-24 rounded-[12px]' type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
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
                <DialogContent className="sm:max-w-[549px] rounded-[40px] p-[50px] min-h-[686px]">
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
                            <>
                                <DialogTitle className='font-semibold text-[2.5rem] text-[#333333]'>Account Created</DialogTitle>
                                <figure className='w-full flex items-center justify-center py-5'>
                                    <img src={logo} alt="scoutabl logo" />
                                </figure>
                                <span className="text-black text-lg font-medium">
                                    You just took your first step to better hiring.
                                </span>
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <a href="/organization-setup" className='bg-gradient-custom h-[54px] w-[296px] rounded-[20px] [box-shadow:0px_0px_4px_rgba(0,_0,_0,_0.25)] hover:opacity-90 flex items-center justify-center'>Setup your Account</a>
                                    <Button
                                        onClick={() => {
                                            setOpen(false);
                                            resetStates();
                                            setIsVerified(false);
                                        }}
                                        className='flex items-center justify-center gap-2 bg-black rounded-[12px] h-10 w-[129px] mt-4'
                                    >
                                        <span className='text-white font-semibold text-sm'>Close</span>
                                    </Button>
                                </div>
                            </>
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
        </div >
    );
};

export default SignupPage; 