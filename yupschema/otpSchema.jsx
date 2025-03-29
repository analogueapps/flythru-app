import * as Yup from "yup";

const otpValidationSchema = (applanguage) =>
  Yup.object().shape({
    otp: Yup.string()
      .required(
        applanguage === "eng"
          ? "Please enter the OTP to proceed"
          : "يرجى إدخال رمز التحقق للمتابعة"
      )
      .length(
        4,
        applanguage === "eng"
          ? "OTP must be 4 digits long"
          : "يجب أن يكون رمز التحقق مكونًا من 4 أرقام"
      )
      .matches(
        /^\d+$/,
        applanguage === "eng"
          ? "OTP must only contain digits (0-9)"
          : "يجب أن يحتوي رمز التحقق على أرقام فقط (0-9)"
      ),
  });

export { otpValidationSchema };
