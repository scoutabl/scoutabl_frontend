import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import googleIcon from '/googleIcon.svg'
import micorosoftIcon from '/microsoftIcon.svg'
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
const Login = () => {
    const formSchema = z.object({
        email: z.string().email({ message: "Email is required" }),
        password: z.string().min(8, { message: "Password is required" }),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    function onSubmit(values) {
        console.log(values)
    }

    return (
        <div className='flex min-h-screen'>
            {/* Background Section */}

            <GradientBackground />
            {/* Form Section */}
            <div className="w-1/3 flex items-center justify-center">
                <div className="w-full max-w-[342px] mx-auto px-4">
                    <h1 className='pb-6 text-[3.25rem] font-bold leading-[51.9px] tracking-[-6%]'>Welcome<br /> to Scoutabl</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                            <Input type="password" placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center justify-start gap-2'>
                                    <input className='appearance-none w-3.5 h-3.5 bg-white border-2 rounded border-black outline checked:bg-purple-800' type="checkbox" name="rememberMe" id="rememberMe" />
                                    <label className='text-primarytext text-xs font-medium' htmlFor="rememberMe">Remember me</label>
                                </div>
                                <a href="#" className='text-primarytext text-xs font-medium'>Forgot Password?</a>
                            </div>
                            <div className='w-full flex items-center justify-center'>
                                <Button className='bg-gradient-custom h-10 w-24 rounded-[12px]' type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </Button>
                            </div>
                        </form>
                        <div className='py-[22px] flex items-center justify-center gap-4 whitespace-nowrap'>
                            <div className='h-px bg-[#CFDFE2] flex-1'></div>
                            <p className='text-primarytext text-sm font-normal'>Or Sign in with</p>
                            <div className='h-px bg-[#CFDFE2] flex-1'></div>
                        </div>
                        <div className='flex items-center justify-center gap-5'>
                            <a href="#">
                                <img src={micorosoftIcon} alt="Microsoft" className='w-[29.24px] h-[29.24px]' />
                            </a>
                            <a href="#">
                                <img src={googleIcon} alt="Google" className='w-[29.24px] h-[29.24px]' />
                            </a>
                        </div>
                        <span className='pt-6 block text-center'>Don't have an account? <a href="/register" className='text-secondarytext'>Don&apos;t Miss Out</a></span>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login; 