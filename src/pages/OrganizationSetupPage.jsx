import React from 'react';
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
import logo from '/logo.svg';
import { FormProvider, useFormState } from '@/context/FormContext';

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
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Customize your Organization</h2>
            <p className="text-gray-500 mb-8">These details allow us to customize your experience.</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Name*</FormLabel>
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
                                    <FormLabel>Company Type*</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
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
                                    <FormLabel>Employee Count*</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select count" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1-10">1-10</SelectItem>
                                            <SelectItem value="11-50">11-50</SelectItem>
                                            <SelectItem value="51-200">51-200</SelectItem>
                                            <SelectItem value="201-500">201-500</SelectItem>
                                            <SelectItem value="501+">501+</SelectItem>
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
                                    <FormLabel>Company Location*</FormLabel>
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
        </div>
    );
}

// Step 2: Setup Goals
function SetupLinksStep() {
    const { state, dispatch } = useFormState();

    // Schema for step 1
    const schema = z.object({
        companyWebsite: z.string().min(1, { message: "Company name is required" }),
        helpDeskLinK: z.string().min(1, { message: "Company type is required" }),
        carrerPageLink: z.string().min(1, { message: "Employee count is required" }),
        companyAddress: z.string().min(1, { message: "Country is required" }),
        contactEmail: z.string().min(1, { message: "City is required" }),
        contactNumber: z
            .string()
            .refine(isValidPhoneNumber, { message: "Invalid phone number" })
            .or(z.literal("")),
    });

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {

            companyWebsite: state.formData.companyWebsite,
            helpDeskLinK: state.formData.helpDeskLinK,
            carrerPageLink: state.formData.carrerPageLink,
            companyAddress: state.formData.companyAddress,
            contactEmail: state.formData.contactEmail,
            contactNumber: state.formData.contactNumber
        }
    });

    function onSubmit(values) {
        dispatch({
            type: 'SET_FORM_DATA',
            payload: {
                companyName: values.companyWebsite,
                companyType: values.helpDeskLinK,
                employeeCount: values.carrerPageLink,
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
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Add your Links </h2>
            <p className="text-gray-500 mb-8">These details allow Orion to outreach to candidates.</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="companyWebsite"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>companyWebsite</FormLabel>
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
                            name="helpDeskLinK"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>helpDesk LinK*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="www.scoutabl.com/helpdesk" {...field} />
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
                                    <FormLabel>Career Page Link*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="www.scoutabl.com/jobs" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="companyAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Address*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="2443 Sierra Nevada Road, Mammoth Lakes CA 93546" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Email</FormLabel>
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
                                    <FormDescription className="text-left">
                                        Enter a phone number
                                    </FormDescription>
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
        </div>
    );
}

// Step 3: Mission & Vision
function MissionVisionStep() {
    const { state, dispatch } = useFormState();

    const schema = z.object({
        mission: z.string().min(1, { message: "Mission statement is required" }),
        vision: z.string().min(1, { message: "Vision statement is required" }),
    });

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            mission: state.formData.mission,
            vision: state.formData.vision,
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
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Mission & Vision</h2>
            <p className="text-gray-500 mb-8">Tell us about your company's mission and vision.</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="mission"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mission Statement*</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your mission statement" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="vision"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vision Statement*</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your vision statement" {...field} />
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

    const schema = z.object({
        website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
        linkedin: z.string().url({ message: "Please enter a valid LinkedIn URL" }).optional().or(z.literal('')),
    });

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            website: state.formData.website,
            linkedin: state.formData.linkedin,
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
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Setup Social Media</h2>
            <p className="text-gray-500 mb-8">Connect your company's online presence.</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Website</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://your-company.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>LinkedIn Profile</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://linkedin.com/company/your-company" {...field} />
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

// Step 5: Upload Logo
function UploadLogoStep() {
    const { state, dispatch } = useFormState();
    const [previewUrl, setPreviewUrl] = React.useState(state.formData.logo);

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
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Upload Company Logo</h2>
            <p className="text-gray-500 mb-8">Add your company logo to complete your profile.</p>

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
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
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
        { number: 1, label: 'Organization Detail', desc: 'Setup your Scoutabl details' },
        { number: 2, label: 'Setup Goals', desc: 'What do you want to achieve?' },
        { number: 3, label: 'Mission & Vision', desc: 'Tell us your story' },
        { number: 4, label: 'Setup Social', desc: 'Connect your accounts' },
        { number: 5, label: 'Upload Logo', desc: 'Personalize your profile' },
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
                    <div className="flex justify-end p-4">
                        <button className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center px-8 py-4">
                        <StepContent />
                    </div>

                    {/* Progress indicator (1/5, 2/5, etc) */}
                    <div className="flex justify-center pb-6">
                        <div className="flex items-center">
                            <span className="text-sm text-gray-500">
                                <StepIndicator />
                            </span>
                        </div>
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
            {Array.from({ length: state.totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${index + 1 === state.step
                        ? 'bg-blue-500'
                        : index + 1 < state.step
                            ? 'bg-blue-300'
                            : 'bg-gray-300'
                        }`}
                />
            ))}
            <span className="ml-2 text-sm text-gray-600">{state.step}/{state.totalSteps}</span>
        </div>
    );
}

export default OrganizationSetupPage; 