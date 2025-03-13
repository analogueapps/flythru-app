import * as Yup from "yup";

const otpValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .required('Please enter the OTP to proceed')
    .length(4, 'OTP must be 4 digits long') 
    .matches(/^\d+$/, 'OTP must only contain digits (0-9)') // Validate numeric format
});

export { otpValidationSchema };