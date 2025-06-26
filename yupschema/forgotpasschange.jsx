import * as Yup from "yup";

const forgotpasschangeSchema = (applanguage) =>
  Yup.object().shape({
    email: Yup.string().required(
      applanguage === "eng"
        ? "Email is required"
        : "البريد الإلكتروني مطلوب"
    ),

    password: Yup.string()
      .min(
        8,
        applanguage === "eng"
          ? "Password must be at least 8 characters"
          : "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل"
      )
      .max(
        14,
        applanguage === "eng"
          ? "Password must be at most 14 characters"
          : "يجب ألا تتجاوز كلمة المرور 14 حرفًا"
      )
      .test(
        "no-spaces",
        applanguage === "eng"
          ? "Password should not contain spaces"
          : "يجب ألا تحتوي كلمة المرور على مسافات",
        (value) => value ? !/\s/.test(value) : false
      )
      .matches(
        /[a-z]/,
        applanguage === "eng"
          ? "Must include a lowercase letter"
          : "يجب أن تحتوي على حرف صغير"
      )
      .matches(
        /[A-Z]/,
        applanguage === "eng"
          ? "Must include an uppercase letter"
          : "يجب أن تحتوي على حرف كبير"
      )
      .matches(
        /\d/,
        applanguage === "eng"
          ? "Must include a number"
          : "يجب أن تحتوي على رقم"
      )
      .matches(
        /[@$₹!%*-+/.:;"'<>,{}_=₩€£?&#]/,
        applanguage === "eng"
          ? "Must include a special character"
          : "يجب أن تحتوي على رمز خاص"
      )
      .required(
        applanguage === "eng"
          ? "Password is required"
          : "كلمة المرور مطلوبة"
      ),

    confirmPassword: Yup.string()
      .required(
        applanguage === "eng"
          ? "Confirm password is required"
          : "تأكيد كلمة المرور مطلوب"
      )
      .oneOf(
        [Yup.ref("password")],
        applanguage === "eng"
          ? "Passwords must match"
          : "يجب أن تتطابق كلمتا المرور"
      )
  });

export default forgotpasschangeSchema;
