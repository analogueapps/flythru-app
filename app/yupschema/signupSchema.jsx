import * as Yup from "yup";

const signupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format") 
    .required("Email is required"), 

  password: Yup.string()
  .min(8, "Password must be at least 8 characters")
  .max(14, "Password must be at most 14 characters")
  .matches(/[a-z]/, "Must include a lowercase letter")
  .matches(/[A-Z]/, "Must include an uppercase letter")
  .matches(/\d/, "Must include a number")
  .matches(/[@$!%*?&#]/, "Must include a special character")
  .required("Password is required"),
});

export default signupSchema
