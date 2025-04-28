import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { isValidPhoneNumber } from "react-phone-number-input";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from '@/components/ui/PhoneInput';
import { FormProvider, useFormState } from '@/context/FormContext';
import { Textarea } from '@/components/ui/textarea';
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import previewLogo from '/previewLogo.svg';
import logo from '/logo.svg';

// Step 1: Organization Details
function OrganizationDetailsStep() {
    const { state, dispatch } = useFormState();

    // Schema for step 1
    const schema = z.object({
        companyName: z.string().min(1, { message: "Company name is required" }),
        companyType: z.string().min(1, { message: "Company type is required" }),
        employeeCount: z.string().min(1, { message: "Employee count is required" }),
        country: z.string().min(1, { message: "Country is required" }),
        city: z.string().min(1, { message: "City is required" }),
    });

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            companyName: state.formData.companyName,
            companyType: state.formData.companyType,
            employeeCount: state.formData.employeeCount,
            country: state.formData.companyLocation.country,
            city: state.formData.companyLocation.city,
        }
    });

    function onSubmit(values) {
        dispatch({
            type: 'SET_FORM_DATA',
            payload: {
                companyName: values.companyName,
                companyType: values.companyType,
                employeeCount: values.employeeCount,
                companyLocation: {
                    country: values.country,
                    city: values.city,
                }
            }
        });

        dispatch({ type: 'NEXT_STEP' });
    }

    return (
        <div className="w-full max-w-[642px] mx-auto flex flex-col items-center justify-center">
            <h2 className="text-[2rem] font-bold mb- text-center">Customize your <span className='bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text'>Organization</span></h2>
            <p className="text-[#5C5C5C] mb-10 text-center">These details allow us to customize your experience.</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-xl">
                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Name<span className='text-[#E45270]'>*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your company name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="companyType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Type<span className='text-[#E45270]'>*</span></FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}

                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Company Type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="startup">Startup</SelectItem>
                                            <SelectItem value="sme">SME</SelectItem>
                                            <SelectItem value="enterprise">Enterprise</SelectItem>
                                            <SelectItem value="nonprofit">Non-profit</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="employeeCount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employee Count<span className='text-[#E45270]'>*</span></FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Employee Count" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="15">1-15</SelectItem>
                                            <SelectItem value="30">15-30</SelectItem>
                                            <SelectItem value="50">31-50</SelectItem>
                                            <SelectItem value="100">51-100</SelectItem>
                                            <SelectItem value="200">101-200</SelectItem>
                                            <SelectItem value="300">201-300</SelectItem>
                                            <SelectItem value="400">301-400</SelectItem>
                                            <SelectItem value="500">401-500</SelectItem>
                                            <SelectItem value="750">501-750</SelectItem>
                                            <SelectItem value="1000">751-1000</SelectItem>
                                            <SelectItem value="1000+">1000+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Location<span className='text-[#E45270]'>*</span></FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="us">United States</SelectItem>
                                            <SelectItem value="ca">Canada</SelectItem>
                                            <SelectItem value="uk">United Kingdom</SelectItem>
                                            <SelectItem value="au">Australia</SelectItem>
                                            {/* Add more countries as needed */}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>&nbsp;</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select city" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ny">New York</SelectItem>
                                            <SelectItem value="sf">San Francisco</SelectItem>
                                            <SelectItem value="ch">Chicago</SelectItem>
                                            <SelectItem value="la">Los Angeles</SelectItem>
                                            {/* Add more cities as needed */}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="bg-gradient-custom rounded-[20px] min-w-[100px]">
                            Continue
                        </Button>
                    </div>
                </form>
            </Form>
        </div >
    );
}

// Step 2: Setup Goals
function SetupLinksStep() {
    const { state, dispatch } = useFormState();

    // Schema for step 2
    const schema = z.object({
        companyWebsite: z.string()
            .regex(/^(https?:\/\/)?([\w\d\-_]+\.+[A-Za-z]{2,})+\/?/, { message: "Please enter a valid URL" })
            .min(1, { message: "Company website is required" }),
        helpDeskLink: z.string()
            .regex(/^(https?:\/\/)?([\w\d\-_]+\.+[A-Za-z]{2,})+\/?/, { message: "Please enter a valid URL" })
            .min(1, {
                message: "Help desk link is required"
            }),
        careerPageLink: z.string()
            .regex(/^(https?:\/\/)?([\w\d\-_]+\.+[A-Za-z]{2,})+\/?/, { message: "Please enter a valid URL" })
            .min(1, {
                message: "Career page link is required"
            }),
        companyAddress: z.string().min(1, { message: "Company address is required" }),
        contactEmail: z.string().email({ message: "Please enter a valid email" }),
        contactNumber: z
            .string()
            .refine(isValidPhoneNumber, { message: "Invalid phone number" })
            .or(z.literal("")),
    });

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            companyWebsite: state.formData.companyWebsite,
            helpDeskLink: state.formData.helpDeskLink,
            careerPageLink: state.formData.careerPageLink,
            companyAddress: state.formData.companyAddress,
            contactEmail: state.formData.contactEmail,
            contactNumber: state.formData.contactNumber
        }
    });

    function onSubmit(values) {
        dispatch({
            type: 'SET_FORM_DATA',
            payload: {
                companyWebsite: values.companyWebsite,
                helpDeskLink: values.helpDeskLink,
                careerPageLink: values.careerPageLink,
                companyAddress: values.companyAddress,
                contactEmail: values.contactEmail,
                contactNumber: values.contactNumber
            }
        });

        dispatch({ type: 'NEXT_STEP' });
    }

    const handleBack = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    return (
        <div className="w-full max-w-[642px] mx-auto flex flex-col items-center justify-center">
            <h2 className="text-[2rem] font-bold mb- text-center">Add your <span className='bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text'>Links</span></h2>
            <p className="text-[#5C5C5C] mb-10 text-center">These details allow Orion to outreach to candidates.</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-xl">
                    <FormField
                        control={form.control}
                        name="companyWebsite"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Website<span className='text-[#E45270]'>*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="scoutabl.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="helpDeskLink"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Help Desk Link<span className='text-[#E45270]'>*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://www.scoutabl.com/helpdesk" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="careerPageLink"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Career Page Link<span className='text-[#E45270]'>*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://wwww.scoutabl.com/jobs" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="companyAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Address<span className='text-[#E45270]'>*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="2443 Sierra Nevada Road, Mammoth Lakes CA 93546" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Email<span className='text-[#E45270]'>*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Contact Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contactNumber"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-start">
                                    <FormLabel className="text-left">Phone Number</FormLabel>
                                    <FormControl className="w-full">
                                        <PhoneInput placeholder="Enter a phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-between pt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            className="rounded-[20px] min-w-[100px]"
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-custom rounded-[20px] min-w-[100px]"
                        >
                            Continue
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

// Step 3: Mission & Vision
function MissionVisionStep() {
    const { state, dispatch } = useFormState();

    const schema = z.object({
        companyMission: z.string().min(1, { message: "Company Mission is required" }),
        companyVision: z.string().min(1, { message: "Company Vision is required" }),
    });

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            companyMission: state.formData.mission,
            companyVision: state.formData.vision,
        }
    });

    function onSubmit(values) {
        dispatch({
            type: 'SET_FORM_DATA',
            payload: values
        });

        dispatch({ type: 'NEXT_STEP' });
    }

    const handleBack = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    return (
        <div className="w-full max-w-[642px] mx-auto">
            <h2 className="text-[2rem] font-bold mb-3 text-center">What&apos;s your <span className='bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text'>Goal</span></h2>
            <p className="text-[#5C5C5C] mb-10 text-center">These details allow us to showcase the essence of your company.</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-xl">
                    <FormField
                        control={form.control}
                        name="companyMission"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Mission<span className='text-[#E45270]'>*</span></FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter your company mission" {...field} className='resize-none' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="companyVision"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Vision<span className='text-[#E45270]'>*</span></FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter your company vision" {...field} className='resize-none' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            className="rounded-[20px] min-w-[100px]"
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-custom rounded-[20px] min-w-[100px]"
                        >
                            Continue
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

// Step 4: Setup Social
function SocialMediaStep() {
    const { state, dispatch } = useFormState();
    const [modal, setModal] = useState(null); // which modal is open
    const [tempUrl, setTempUrl] = useState(""); // temp value for modal input

    const socialPlatforms = [
        { key: "linkedin", icon: <FaLinkedinIn />, label: "LinkedIn" },
        { key: "twitter", icon: <FaXTwitter />, label: "Twitter" },
        { key: "facebook", icon: <FaFacebookF />, label: "Facebook" },
        { key: "instagram", icon: <RiInstagramFill />, label: "Instagram" },
    ];

    const schema = z.object({
        overview: z.string().min(1, { message: "Overview is required" }),
        linkedin: z.string().url({ message: "Please enter a valid LinkedIn URL" }).optional().or(z.literal('')),
        twitter: z.string().url({ message: "Please enter a valid Twitter URL" }).optional().or(z.literal('')),
        facebook: z.string().url({ message: "Please enter a valid Facebook URL" }).optional().or(z.literal('')),
        instagram: z.string().url({ message: "Please enter a valid Instagram URL" }).optional().or(z.literal('')),
    });

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            overview: state.formData.overview,
            linkedin: state.formData.linkedin,
            twitter: state.formData.twitter,
            facebook: state.formData.facebook,
            instagram: state.formData.instagram,
        }
    });

    function onSubmit(values) {
        dispatch({
            type: 'SET_FORM_DATA',
            payload: values
        });

        dispatch({ type: 'NEXT_STEP' });
    }

    const handleBack = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    // Open modal for a platform
    const openModal = (platform) => {
        setTempUrl(form.getValues(platform) || "");
        setModal(platform);
    };

    return (
        <div className="w-full max-w-[642px] mx-auto">
            <h2 className="text-[2rem] font-bold mb-3 text-center">What&apos;s your <span className='bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text'>Specialty</span></h2>
            <p className="text-[#5C5C5C] mb-10 text-center">These details allow Orion to customize your culture tests</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-xl">
                    <FormField
                        control={form.control}
                        name="overview"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Overview of Products/ Services<span className='text-[#E45270]'>*</span></FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter a brief overview of your company" {...field} className='resize-none' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex items-center justify-center gap-3'>
                        {socialPlatforms.map(({ key, icon, label }) => (
                            <button
                                type="button"
                                key={key}
                                className={`group w-[35px] h-[35px] rounded-full border-2 flex items-center justify-center hover:bg-gradient-to-r from-[#806BFF] to-[#A669FD]
                  ${form.getValues(key) ? "bg-gradient-to-r from-[#806BFF] to-[#A669FD] text-white border-[#A669FD]" : "bg-white border-[#A669FD]"}
                `}
                                onClick={() => openModal(key)}
                                title={label}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>

                    {/* Modal */}
                    <Dialog open={!!modal} onOpenChange={open => !open && setModal(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Add {modal && modal.charAt(0).toUpperCase() + modal.slice(1)} URL
                                </DialogTitle>
                            </DialogHeader>
                            <form>
                                <Input
                                    value={form.watch(modal) || ""}
                                    onChange={e => form.setValue(modal, e.target.value, { shouldValidate: true })}
                                    placeholder={`Enter ${modal} URL`}
                                    autoFocus
                                />
                                {form.formState.errors[modal] && (
                                    <div className="text-red-500 text-xs mt-1">
                                        {form.formState.errors[modal].message}
                                    </div>
                                )}
                                <DialogFooter className="flex justify-between mt-4">
                                    <Button type="button" variant="destructive" onClick={() => setModal(null)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        className="bg-gradient-custom hover:bg-gradient-custom/50"
                                        onClick={async () => {
                                            const value = form.watch(modal);
                                            if (!value) {
                                                form.setError(modal, { type: "manual", message: "Please enter a URL" });
                                                return;
                                            }
                                            const valid = await form.trigger(modal);
                                            if (valid) setModal(null);
                                        }}
                                    >
                                        Save
                                    </Button>
                                </DialogFooter>

                            </form>
                        </DialogContent>
                    </Dialog>
                    <div className="flex justify-between pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            className="rounded-[20px] min-w-[100px]"
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-custom rounded-[20px] min-w-[100px]"
                        >
                            Continue
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

// Step 5: Upload Logo
function UploadLogoStep() {
    const { state, dispatch } = useFormState();
    const [previewUrl, setPreviewUrl] = useState(state.formData.logo);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);

            dispatch({
                type: 'SET_FORM_DATA',
                payload: { logo: file }
            });
        }
    };

    const handleSubmit = async () => {
        // Here you would handle the final form submission
        // This would typically involve an API call with all the collected data

        const formData = new FormData();
        Object.entries(state.formData).forEach(([key, value]) => {
            if (key === 'companyLocation') {
                formData.append('country', value.country);
                formData.append('city', value.city);
            } else if (key === 'goals') {
                formData.append('goals', JSON.stringify(value));
            } else if (key === 'logo' && value) {
                formData.append('logo', value);
            } else {
                formData.append(key, value);
            }
        });

        try {
            // Example API call - replace with your actual endpoint
            // const response = await fetch('https://dev.scoutabl.com/api/organization/setup', {
            //     method: 'POST',
            //     body: formData,
            //     headers: {
            //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            //     },
            // });

            // if (response.ok) {
            //     // Redirect to dashboard or home page
            //     window.location.href = '/dashboard';
            // }

            // For now, just redirect
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleBack = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    return (
        <div className="w-full max-w-[642px] mx-auto">
            <h2 className="text-[2rem] font-bold mb-3 text-center">Upload your <span className='bg-gradient-to-r from-[#806BFF] to-[#A669FD] inline-block text-transparent bg-clip-text'>Logo</span></h2>
            <p className="text-[#5C5C5C] mb-10 text-center">These details allow us to customize your experience.</p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                {previewUrl ? (
                    <div className="mb-4">
                        <img
                            src={previewUrl}
                            alt="Company Logo Preview"
                            className="mx-auto max-h-40 object-contain"
                        />
                    </div>
                ) : (
                    <div className="text-gray-400 mb-4">
                        <img src={previewLogo} alt="Upload Logo" className="mx-auto" />
                        <p className="text-sm">No logo uploaded yet</p>
                    </div>
                )}

                <label className="bg-gradient-custom text-white py-2 px-4 rounded-lg cursor-pointer inline-block">
                    {previewUrl ? 'Change Logo' : 'Upload Logo'}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>

                <p className="text-sm text-gray-500 mt-2">
                    Recommended: Square image (1:1 ratio), PNG or JPG format
                </p>
            </div>

            <div className="flex justify-between pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="rounded-[20px] min-w-[100px]"
                >
                    Back
                </Button>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-gradient-custom rounded-[20px] min-w-[100px]"
                >
                    Complete Setup
                </Button>
            </div>
        </div>
    );
}

// Progress indicator sidebar
function ProgressSidebar() {
    const { state, dispatch } = useFormState();

    const steps = [
        { number: 1, label: 'Organization Detail', desc: 'Setup Your Account Details' },
        { number: 2, label: 'Setup Links', desc: 'Add Your Weblinks' },
        { number: 3, label: 'Mission & Vision', desc: 'Add Your Goals' },
        { number: 4, label: 'Setup Social', desc: 'Add Your Networks' },
        { number: 5, label: 'Upload Logo', desc: 'Review and Submit' },
    ];

    const handleStepClick = (stepNumber) => {
        // Only allow navigation to previous steps
        if (stepNumber < state.step) {
            dispatch({ type: 'GO_TO_STEP', payload: stepNumber });
        }
    };

    return (
        <div className="bg-white py-8 px-6 rounded-l-[40px] h-full">
            <div className="flex items-center mb-10">
                <img src={logo} alt="Scoutabl Logo" className="h-8" />
                <span className="ml-2 font-semibold text-xl">Scoutabl</span>
            </div>

            <div className="space-y-4">
                {steps.map((step) => (
                    <div
                        key={step.number}
                        className={`flex items-center p-2 rounded-lg cursor-pointer ${step.number === state.step
                            ? 'bg-blue-50'
                            : step.number < state.step
                                ? 'opacity-70 hover:bg-gray-100'
                                : 'opacity-50'
                            }`}
                        onClick={() => handleStepClick(step.number)}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step.number === state.step
                            ? 'bg-gradient-custom text-white'
                            : step.number < state.step
                                ? 'bg-blue-200 text-blue-800'
                                : 'bg-gray-200 text-gray-500'
                            }`}>
                            {step.number}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">{step.label}</h3>
                            <p className="text-xs text-gray-500">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Illustration at the bottom */}
            <div className="mt-auto pt-8">
                <img
                    src="/setup-illustration.svg"
                    alt="Setup Illustration"
                    className="max-w-full"
                    onError={(e) => e.target.style.display = 'none'} // In case the image doesn't exist
                />
            </div>
        </div>
    );
}

// Step content based on current step
function StepContent() {
    const { state } = useFormState();

    switch (state.step) {
        case 1:
            return <OrganizationDetailsStep />;
        case 2:
            return <SetupLinksStep />;
        case 3:
            return <MissionVisionStep />;
        case 4:
            return <SocialMediaStep />;
        case 5:
            return <UploadLogoStep />;
        default:
            return <OrganizationDetailsStep />;
    }
}

// Main component
const OrganizationSetupPage = () => {
    return (
        <FormProvider>
            <div className="flex min-h-screen">
                {/* Left sidebar with progress */}
                <div className="w-1/4 bg-white shadow-md">
                    <ProgressSidebar />
                </div>

                {/* Main content area */}
                <div className="w-3/4 bg-gray-50 flex flex-col">
                    {/* <div className="flex justify-end p-4">
                        <button className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div> */}
                    {/* Progress indicator (1/5, 2/5, etc) */}
                    <div className="flex-1 flex flex-col gap-3 items-center justify-center px-8 py-4">

                        <StepIndicator />
                        <StepContent />
                    </div>


                </div>
            </div>
        </FormProvider>
    );
};

// Progress indicator component
function StepIndicator() {
    const { state } = useFormState();
    return (
        <div className="flex items-center gap-2">
            <span className="text-base text-[#333333]">{state.step}/{state.totalSteps}</span>
        </div>
    );
}

export default OrganizationSetupPage; 