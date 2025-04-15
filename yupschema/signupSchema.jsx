import * as Yup from "yup";

const signupSchema = (applanguage) =>
  Yup.object().shape({
    email: Yup.string()
      .required(
        applanguage === "eng"
          ? "Email is required"
          : "البريد الإلكتروني مطلوب"
      )
      .test(
        "valid-email",
        applanguage === "eng"
          ? "Invalid email format"
          : "تنسيق البريد الإلكتروني غير صالح",
        (value) => {
          if (!value) return false;
          value = value.toLowerCase().trim();

          if ((value.match(/@/g) || []).length !== 1) return false;
          if (/^[^a-z0-9]/.test(value) || /[^a-z0-9@._-]/.test(value))
            return false;
          if (!value.includes("@")) return false;
          if (!value.includes(".")) return false;

          const domain = value.split(".").pop();
          const validDomains = [
            "com",
            "org",
            "net",
            "edu",
            "gov",
            "mil",
            "in",
            "us",
            "uk",
            "au",
            "ca",
            "eu",
          ];
          if (!validDomains.includes(domain)) return false;

          return true;
        }
      )
      .test(
        "no-spaces",
        applanguage === "eng"
          ? "Email cannot contain spaces"
          : "لا يمكن أن يحتوي البريد الإلكتروني على مسافات",
        (value) => {
          if (value && /\s/.test(value)) return false;
          return true;
        }
      )
      .transform((value) => (value ? value.toLowerCase().trim() : value)),

    password: Yup.string()
      .min(
        8,
        applanguage === "eng"
          ? "Password must be at least 8 characters"
          : "يجب أن تكون كلمة المرور 8 أحرف على الأقل"
      )
      .max(
        14,
        applanguage === "eng"
          ? "Password must be at most 14 characters"
          : "يجب ألا تزيد كلمة المرور عن 14 حرفًا"
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
        /[@$!%*?&#]/,
        applanguage === "eng"
          ? "Must include a special character"
          : "يجب أن تحتوي على رمز خاص"
      )
      .required(
        applanguage === "eng"
          ? "Password is required"
          : "كلمة المرور مطلوبة"
      ),
  });

export default signupSchema;
