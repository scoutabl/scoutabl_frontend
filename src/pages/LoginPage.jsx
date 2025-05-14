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

const LoginPage = () => {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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

    async function onSubmit(values) {
        try {
            setIsLoading(true);
            setError('');
            console.log('Form values:', values);

            const success = await login(values.email, values.password, rememberMe);
            if (!success) {
                setError('Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Login submission error:', error);
            setError('An error occurred during login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='flex min-h-screen'>
            {/* Background Section */}
            <GradientBackground />
            {/* Form Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-8 relative bg-white">
                <div className="w-full max-w-[342px]">
                    <h1 className='text-[50px] font-bold text-[#333333] mb-8'>
                        Welcome to Scoutabl
                    </h1>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                            {/* email field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-primarytext text-base font-medium'>Business Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your business email"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage className='py-1' />
                                    </FormItem>
                                )}
                            />
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && (
                                <div className="p-3 text-red-500 bg-red-100 rounded-md text-sm">
                                    {error}
                                </div>
                            )}
                            <div className='flex items-center justify-between mt-1'>
                                <div className='flex items-center justify-start gap-2'>
                                    <input
                                        className='appearance-none w-3.5 h-3.5 bg-white border-2 rounded border-black outline checked:bg-purple-800'
                                        type="checkbox"
                                        name="rememberMe"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={isLoading}
                                    />
                                    <label className='text-primarytext text-xs font-medium' htmlFor="rememberMe">Remember me</label>
                                </div>
                                <PasswordRecoveryModal />
                            </div>
                            <div className='w-full flex items-center justify-center'>
                                <Button
                                    className='bg-gradient-custom h-10 w-24 rounded-[12px]'
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    )}
                                </Button>
                            </div>
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
                        <span className='pt-6 block text-center'>Don&apos;t have an account? <a href="/register" className='text-secondarytext'>Don&apos;t Miss Out</a></span>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 