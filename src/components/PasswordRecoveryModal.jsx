import React, { useState } from 'react'
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
const PasswordRecoveryModal = () => {
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    cosnt[email, setEmail] = useState('')

    const handleResend = () => {
        console.log()
    }

    return (
        <Dialog >
            <DialogTrigger asChild>
                <span className='text-primarytext text-xs font-medium cursor-pointer'>Forgot Password?</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[549px] rounded-[40px] p-[50px]">
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
                    <figure className='w-full flex items-center justify-center py-5'>
                        <img src={logo} alt="scoutabl logo" />
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
                            <OtpInput onChange={setOtpValue} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key='email'
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.3 }}
                            className="grid gap-4 py-4">
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Enter your email adress
                                </Label>
                                <Input
                                    id="email"
                                    // defaultValue="Enter your email address"
                                    placeholder="Enter your email address"
                                    className="col-span-3"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <DialogFooter className='flex flex-col gap-9'>
                    {isCodeSent ? (
                        <>
                            <Button type="submit" className='bg-gradient-custom h-[54px] w-[296px] rounded-[20px] [box-shadow:0px_0px_4px_rgba(0,_0,_0,_0.25)] hover:opacity-90'>Verify</Button>
                            <DialogClose asChild>
                                <Button className='flex items-center justify-center gap-2 bg-black rouned-[12px] h-10 w-[129px]'>
                                    <ChevronLeft />
                                    <span className='text-white font-semibold text-sm'>Back</span>
                                </Button>
                            </DialogClose>
                        </>
                    ) :
                        (
                            <>
                                <Button onClick={handleResend} type="submit" className='bg-gradient-custom h-[54px] w-[296px] rounded-[20px] [box-shadow:0px_0px_4px_rgba(0,_0,_0,_0.25)] hover:opacity-90'>Send Code</Button>
                                <DialogClose asChild>
                                    <Button className='flex items-center justify-center gap-2 bg-black rouned-[12px] h-10 w-[129px]'>
                                        <ChevronLeft />
                                        <span className='text-white font-semibold text-sm'>Back</span>
                                    </Button>
                                </DialogClose>
                            </>
                        )

                    }
                    <Button type="submit" className='bg-gradient-custom h-[54px] w-[296px] rounded-[20px] [box-shadow:0px_0px_4px_rgba(0,_0,_0,_0.25)] hover:opacity-90'>Send Code</Button>
                    <DialogClose asChild>
                        <Button className='flex items-center justify-center gap-2 bg-black rouned-[12px] h-10 w-[129px]'>
                            <ChevronLeft />
                            <span className='text-white font-semibold text-sm'>Back</span>
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default PasswordRecoveryModal