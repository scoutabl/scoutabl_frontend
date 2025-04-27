import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
    step: 1,
    totalSteps: 5,
    formData: {
        // Step 1: Organization Details
        companyName: '',
        companyType: '',
        employeeCount: '',
        companyLocation: {
            country: '',
            city: '',
        },

        // Step 2: Setup Goals
        goals: [],

        // Step 3: Mission & Vision
        mission: '',
        vision: '',

        // Step 4: Setup Social
        website: '',
        linkedin: '',

        // Step 5: Upload Logo
        logo: null,
    }
};

// Create context
const FormContext = createContext();

// Reducer for state management
function formReducer(state, action) {
    switch (action.type) {
        case 'NEXT_STEP':
            return {
                ...state,
                step: state.step < state.totalSteps ? state.step + 1 : state.step
            };
        case 'PREV_STEP':
            return {
                ...state,
                step: state.step > 1 ? state.step - 1 : state.step
            };
        case 'SET_FORM_DATA':
            return {
                ...state,
                formData: {
                    ...state.formData,
                    ...action.payload
                }
            };
        case 'GO_TO_STEP':
            return {
                ...state,
                step: action.payload
            };
        case 'RESET_FORM':
            return initialState;
        default:
            return state;
    }
}

// Provider component
export function FormProvider({ children }) {
    // Load state from localStorage if available
    const loadState = () => {
        try {
            const savedState = localStorage.getItem('organizationSetupState');
            if (savedState) {
                return JSON.parse(savedState);
            }
        } catch (error) {
            console.error('Error loading state from localStorage:', error);
        }
        return initialState;
    };

    const [state, dispatch] = useReducer(formReducer, loadState());

    // Save state to localStorage whenever it changes
    useEffect(() => {
        try {
            // Remove logo from saved state as it can't be serialized
            const stateToSave = {
                ...state,
                formData: {
                    ...state.formData,
                    logo: state.formData.logo ? true : null // Just save a flag if logo exists
                }
            };
            localStorage.setItem('organizationSetupState', JSON.stringify(stateToSave));
        } catch (error) {
            console.error('Error saving state to localStorage:', error);
        }
    }, [state]);

    return (
        <FormContext.Provider value={{ state, dispatch }}>
            {children}
        </FormContext.Provider>
    );
}

// Custom hook to use the form context
export function useFormState() {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useFormState must be used within a FormProvider');
    }
    return context;
}

export default FormContext; 