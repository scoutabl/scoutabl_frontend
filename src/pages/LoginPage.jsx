import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '@/context/AuthContext';
import PasswordRecoveryModal from '@/components/PasswordRecoveryModal';
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
import googleIcon from '/googleIcon.svg'
import micorosoftIcon from '/microsoftIcon.svg'
import { Eye, EyeOff } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const LoginPage = () => {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [_, setLoggedInUser] = useState(null);
    const formSchema = z.object({
        email: z
            .string()
            .min(1, { message: "Email is required" }).max(50, { message: "Email is too long" })
            .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Invalid email address" })
            .email({ message: "Email is required" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = async (values) => {
        try {
            setIsLoading(true);
            setError('');

            const user = await login(values.email, values.password, rememberMe);

            if (!user) {
                setError('Invalid email or password. Please try again.');
            } else {
                setLoggedInUser(user);
            }
        } catch (error) {
            console.error('🚀 Login submission error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='min-h-screen flex'>
            <GradientBackground />
            <div className="w-full md:w-1/2 md:ml-auto flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 bg-white min-h-screen">
                <div className="w-full max-w-[342px] sm:max-w-[380px] space-y-6">
                    <h1 className='text-[clamp(2rem,_4vw,_3rem)]  font-bold text-[#333333] leading-[1.2]'>
                        Welcome to Scoutabl
                    </h1>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            {/* email field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-primarytext text-[clamp(0.875rem,2vw,1rem)] font-medium'>Business Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-[clamp(2.5rem,3vw,3rem)]"
                                                placeholder="Enter your business email"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage className='py-1 text-[clamp(0.75rem,1.5vw,0.875rem)]' />
                                    </FormItem>
                                )}
                            />
                            {/* Password field*/}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-primarytext text-[clamp(0.875rem,2vw,1rem)] font-medium'>Password</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    className="h-[clamp(2.5rem,3vw,3rem)]"
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
                                        <FormMessage className='text-[clamp(0.75rem,1.5vw,0.875rem)]' />
                                    </FormItem>
                                )}
                            />
                            {error && (
                                <div className="p-3 text-red-500 bg-red-100 rounded-md text-[clamp(0.75rem,1.5vw,0.875rem)]">
                                    {error}
                                </div>
                            )}
                            <div className='flex items-center justify-between mt-1'>
                                <div className='flex items-center justify-start gap-2 group'>
                                    <Checkbox
                                        name="rememberMe"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        disabled={isLoading}
                                        onCheckedChange={setRememberMe}
                                    />
                                    <label className='text-primarytext text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium group-hover:text-purplePrimary duration-300 transition-colors ease-in cursor-pointer' htmlFor="rememberMe">Remember me</label>
                                </div>
                                <PasswordRecoveryModal />
                            </div>
                            <div className='w-full flex items-center justify-center pt-2'>
                                <Button
                                    className='bg-gradient-custom h-[clamp(2.5rem,3vw,3rem)] w-[clamp(5rem,15vw,6rem)] rounded-[12px]'
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[clamp(1.25rem,2vw,1.5rem)] h-[clamp(1.25rem,2vw,1.5rem)]">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    )}
                                </Button>
                            </div>
                        </form>
                        <div className='py-[clamp(1rem,3vw,1.375rem)] flex items-center justify-center gap-4 whitespace-nowrap'>
                            <div className='h-px bg-[#CFDFE2] flex-1'></div>
                            <p className='text-primarytext text-[clamp(0.75rem,1.5vw,0.875rem)] font-normal'>Or Sign in with</p>
                            <div className='h-px bg-[#CFDFE2] flex-1'></div>
                        </div>
                        <div className='flex items-center justify-center gap-5'>
                            <a href="https://dev.scoutabl.com/auth/login/azuread-tenant-oauth2/">
                                <img src={micorosoftIcon} alt="Microsoft" className='w-[clamp(1.5rem,3vw,1.828rem)] h-[clamp(1.5rem,3vw,1.828rem)]' />
                            </a>
                            <a href="https://dev.scoutabl.com/auth/login/google-oauth2/">
                                <img src={googleIcon} alt="Google" className='w-[clamp(1.5rem,3vw,1.828rem)] h-[clamp(1.5rem,3vw,1.828rem)]' />
                            </a>
                        </div>
                        <span className='pt-[clamp(1.5rem,3vw,2rem)] block text-center text-[clamp(0.75rem,1.5vw,0.875rem)]'>
                            Don&apos;t have an account? <a href="/register" className='text-secondarytext'>Don&apos;t Miss Out</a>
                        </span>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 