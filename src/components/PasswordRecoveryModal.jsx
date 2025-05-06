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
import { ChevronLeft } from 'lucide-react';
import logo from '/logo.svg'
import helpIcon from '/helpIcon.svg'
import { Button } from '@/components/ui/button';

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" }).max(50, { message: "Email is too long" })
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Invalid email address" })
        .email({ message: "Email is required" }),
})

const PasswordRecoveryModal = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        }
    });
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [email, setEmail] = useState('')


    useEffect(() => {
        console.log(isCodeSent, email)
    }, [isCodeSent, email])
    const handleSendCode = () => {
        console.log(email, isCodeSent)
        setIsCodeSent(true);
        // Call your API to send the code here
    }



    // const form = useForm({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //         email: "",
    //     }
    // })

    const handleOtpSubmit = (otp) => {
        setOtpValue(otp);
        console.log('OTP entered:', otp);
        // You could also directly trigger verification here if needed
    };


    const onSubmit = async (values) => {

        try {
            const response = await fetch('https://dev.scoutabl.com/api/users/forgot_password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email
                }),
                credentials: 'include'
            })

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Login error response:', errorData);
                throw new Error(errorData.detail || 'Forgot Password Failed');
            }
            const data = await response.json();
            setIsCodeSent(true);
            console.log(data, data.message, data.email_verification)
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }


    return (
        <Dialog >
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
                <AnimatePresence mode='wait'>
                    {isCodeSent ? (
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
                            <OtpInput onOtpSubmit={handleOtpSubmit} onChange={setOtpValue} />
                            <div className='flex flex-col items-center justify-center gap-9'>
                                <Button onClick={() => handleOtpSubmit(otpValue)} className='bg-gradient-custom h-[54px] w-[296px] rounded-[20px] [box-shadow:0px_0px_4px_rgba(0,_0,_0,_0.25)] hover:opacity-90'>Verify</Button>
                                <Button onClick={() => setIsCodeSent(false)} className='flex items-center justify-center gap-2 bg-black rouned-[12px] h-10 w-[129px]'>
                                    <ChevronLeft />
                                    <span className='text-white font-semibold text-sm'>Back</span>
                                </Button>

                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key='email'
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.3 }}
                            className="grid gap-4 py-4">
                            <div >
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-9">
                                    <div className='flex flex-col gap-4'>
                                        <Label htmlFor="email" className="text-right">
                                            Enter your email adress
                                        </Label>
                                        <Input
                                            {...register("email")}
                                            id="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            // defaultValue="Enter your email address"
                                            placeholder="Enter your email address"
                                            className="col-span-3"
                                        />
                                        {errors.email && (
                                            <span className='text-red-500 text-sm font-medium'>{errors.email.message}</span>
                                        )}
                                    </div>
                                    <div className='flex flex-col items-center justify-center gap-9'>
                                        <Button type="submit" className='bg-gradient-custom h-[54px] w-[296px] rounded-[20px] [box-shadow:0px_0px_4px_rgba(0,_0,_0,_0.25)] hover:opacity-90'>Send Code</Button>
                                        <DialogClose asChild>
                                            <Button className='flex items-center justify-center gap-2 bg-black rouned-[12px] h-10 w-[129px]'>
                                                <ChevronLeft />
                                                <span className='text-white font-semibold text-sm'>Back</span>
                                            </Button>
                                        </DialogClose>

                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent >
        </Dialog >
    )
}

export default PasswordRecoveryModal