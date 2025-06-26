import * as Yup from "yup";

const passwordValidation = (applanguage) =>
  Yup.string()
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
    );

const changePassValidationSchema = (applanguage)=> Yup.object().shape({
  oldpassword: Yup.string().required(
    applanguage === "eng"
      ? "Old password is required"
      : "كلمة المرور القديمة مطلوبة"
  ) .min(
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
    ),

  newpassword: passwordValidation(applanguage),

  confirmnewpassword: Yup.string()
    .oneOf(
      [Yup.ref("newpassword"), null],
      applanguage === "eng"
        ? "Passwords must match with new password"
        :"يجب أن تتطابق كلمة المرور مع كلمة المرور الجديدة"
    )
    .required(
      applanguage === "eng"
        ? "Confirm password is required"
        : "تأكيد كلمة المرور مطلوب"
    ),
});

export default changePassValidationSchema