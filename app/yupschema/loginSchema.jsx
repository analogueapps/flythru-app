import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .test("valid-email", "Invalid email format", (value) => {
      if (!value) return false;

      // Ensure lowercase
      value = value.toLowerCase().trim();

      // No double @
      if ((value.match(/@/g) || []).length !== 1) return false;

      // No special characters at the beginning or anywhere except allowed ones
      if (/^[^a-z0-9]/.test(value) || /[^a-z0-9@._-]/.test(value)) return false;

      // Must contain '@'
      if (!value.includes("@")) {
        throw new Yup.ValidationError("Invalid email format. Missing '@' in domain.");
      }

      // Must contain '.'
      if (!value.includes(".")) {
        throw new Yup.ValidationError("Invalid email format. Missing '.' in domain.");
      }

      // Check valid domains
      const domain = value.split(".").pop();
      const validDomains = ["com", "org", "net", "edu", "gov", "mil", "in", "us", "uk", "au", "ca", "eu"];
      if (!validDomains.includes(domain)) return false;

      return true;
    })
    .test("no-spaces", "Email cannot contain spaces", (value) => {
      if (value && /\s/.test(value)) return false;
      return true;
    })
    .transform((value) => (value ? value.toLowerCase().trim() : value)),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(14, "Password must be at most 14 characters")
    .matches(/[a-z]/, "Must include a lowercase letter")
    .matches(/[A-Z]/, "Must include an uppercase letter")
    .matches(/\d/, "Must include a number")
    .matches(/[@$!%*?&#]/, "Must include a special character")
    .required("Password is required"),
});

export default loginSchema;
