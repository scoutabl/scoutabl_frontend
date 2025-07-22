const useMultiStepForm = (steps, defaultValues) => {
    const [currentStep, setCurrentStep] = useState(0);
    const form = useForm({
        defaultValues,
        mode: 'onChange'
    });

    const next = async (fieldsToValidate) => {
        const isValid = await form.trigger(fieldsToValidate);
        if (isValid && currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            return true;
        } else if (!isValid) {
            // Show errors for invalid fields
            fieldsToValidate.forEach(field => {
                const error = form.formState.errors[field];
                if (error) {
                    toast.error(error.message || "This field is required");
                }
            });
        }
        return false;
    };

    const previous = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const goToStep = (stepIndex) => {
        if (stepIndex >= 0 && stepIndex < steps.length) {
            setCurrentStep(stepIndex);
        }
    };

    return {
        currentStep,
        setCurrentStep,
        next,
        previous,
        goToStep,
        form,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === steps.length - 1,
        progress: ((currentStep + 1) / steps.length) * 100
    };
};