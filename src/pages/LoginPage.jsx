import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '@/context/AuthContext';

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
import googleIcon from '/googleIcon.svg'
import micorosoftIcon from '/microsoftIcon.svg'

import GradientBackground from '@/components/GradientBackground';
import PasswordRecoveryModal from '@/components/PasswordRecoveryModal';

const LoginPage = () => {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = z.object({
        email: z.string().email({ message: "Email is required" }),
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

            const success = await login(values.email, values.password);
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
        <div className='grid grid-cols-12 min-h-screen'>
            {/* Background Section */}
            <GradientBackground />

            {/* Form Section */}
            <div className="w-[480px] flex flex-col justify-center px-12 bg-white">
                <div className="w-full">
                    <h1 className='text-[2rem] font-bold text-[#333333] mb-8'>
                        Welcome<br />to Scoutabl
                    </h1>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <div className="p-3 text-red-500 bg-red-100 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-primarytext text-base font-medium pb-2'>Business Email</FormLabel>
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
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-primarytext text-base font-medium pb-2'>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="current-password"
                                                type="password"
                                                placeholder="Enter your password"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center justify-start gap-2'>
                                    <input
                                        className='appearance-none w-3.5 h-3.5 bg-white border-2 rounded border-black outline checked:bg-purple-800'
                                        type="checkbox"
                                        name="rememberMe"
                                        id="rememberMe"
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