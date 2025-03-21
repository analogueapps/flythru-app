import * as Yup from "yup";

const addaddresSchema = Yup.object().shape({
    addressData: Yup.string()
        .required("This field is required")
        .min(5, "Address must be at least 5 characters long")
        .max(100, "Address cannot exceed 100 characters")
        .matches(
            /^(?=.*[a-zA-Z])(?!.*[@#$%^&*()<>])(?!^\d+$)[a-zA-Z0-9\s\/\-.,#]+$/,
            "Address must include letters, allow numbers, and special characters like /-.,# but not @#$%^&*()<> and cannot be only numbers"
        ),

    city: Yup.string()
        .required("City is required")
        .matches(
            /^[a-zA-Z\s\-']+$/,
            "City can only contain letters, spaces, hyphens, and apostrophes"
        )
        .min(2, "City must be at least 2 characters long")
        .max(50, "City cannot exceed 50 characters"),

    state: Yup.string()
        .required("State is required")
        .matches(
            /^[a-zA-Z\s\-']+$/,
            "State can only contain letters, spaces, hyphens, and apostrophes"
        )
        .min(2, "State must be at least 2 characters long")
        .max(50, "State cannot exceed 50 characters"),

    postalCode: Yup.string()
        .required("Postal code is required")
        .matches(
            /^[a-zA-Z0-9\s\-]+$/,
            "Postal code can only contain letters, numbers, spaces, and hyphens"
        )
        .min(3, "Postal code must be at least 3 characters long")
        .max(10, "Postal code cannot exceed 10 characters"),

    locationName: Yup.string()
        .required("Location name is required")
        .matches(
            /^[a-zA-Z0-9\s\-.,#]+$/,
            "Location name can only contain letters, numbers, spaces, hyphens, periods, commas, and hashes"
        )
        .min(2, "Location name must be at least 2 characters long")
        .max(50, "Location name cannot exceed 50 characters"),
});

export default addaddresSchema;