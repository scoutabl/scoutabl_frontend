import { toast } from "sonner";

function errorToString(errors) {
    if (Array.isArray(errors)) {
        return errors.join(", ");
    } else if (typeof errors === "object") {
        return Object.values(errors).join(", ");
    } else {
        return errors;
    }
}

export function handleAPIError(error) {
    console.error(error);
    if (error.response?.data?.detail) {
        toast.error(errorToString(error.response.data.detail));
    } else if (error.response?.data?.non_field_errors) {
        toast.error(errorToString(error.response.data.non_field_errors));
    } else if (error.response?.data?.error) {
        toast.error(errorToString(error.response.data.error));
    } else if (error.response?.data?.errors) {
        toast.error(errorToString(error.response.data.errors));
    } else if (error.response?.data?.message) {
        toast.error(errorToString(error.response.data.message));
    } else if (error.response?.data) {
        toast.error(errorToString(error.response.data));
    }
    else {
        toast.error("An unknown error occurred");
    }
}
