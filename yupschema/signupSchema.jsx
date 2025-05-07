import * as Yup from "yup";

const signupSchema = (applanguage) =>
  Yup.object().shape({
    email: Yup.string()
       .required(
             applanguage === "eng" ? "Email is required" : "البريد الإلكتروني مطلوب"
           )
           .test(
            "no-leading-spaces",
            applanguage === "eng"
              ? "Email cannot start with a space"
              : "لا يمكن أن يبدأ البريد الإلكتروني بمسافة",
            (value) => {
              if (!value) return false;
              return !/^\s/.test(value); // checks for leading whitespace
            }
          )
          
           .test(
             "no-spaces",
             applanguage === "eng"
               ? "Email should not contain any spaces"
               : "لا يجب أن يحتوي البريد الإلكتروني على مسافات",
             (value) => {
               return value ? !/\s/.test(value) : false;
             }
           )  
          //  .test(
          //    "valid-domain",
          //    applanguage === "eng"
          //      ? "Invalid email domain format"
          //      : "تنسيق نطاق البريد الإلكتروني غير صالح",
          //    (value) => {
          //      if (!value) return false;
           
          //      const parts = value.split("@");
          //      if (parts.length !== 2) return false;
           
          //      const domainPart = parts[1];
          //      if (!domainPart || !domainPart.includes(".")) return false;
           
          //      const [domainName, topLevelDomain] = domainPart.split(".");
          //      if (!domainName || !topLevelDomain) return false;
           
          //      const validDomains = [
          //        "com", "org", "net", "edu", "gov", "mil", "in", "us", "uk", "au", "ca", "eu"
          //      ];
          //      return validDomains.includes(topLevelDomain);
          //    }
          //  )
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
     
               if (!value.includes("@")) {
                 throw new Yup.ValidationError(
                   applanguage === "eng"
                     ? "Invalid email format. Missing '@' in domain."
                     : "تنسيق البريد الإلكتروني غير صالح. مفقود '@' في النطاق."
                 );
               }
     
               if (!value.includes(".")) {
                 throw new Yup.ValidationError(
                   applanguage === "eng"
                     ? "Invalid email format. Missing '.' in domain."
                     : "تنسيق البريد الإلكتروني غير صالح. مفقود '.' في النطاق."
                 );
               }
     
              //  const domain = value.split(".").pop();
              //  const validDomains = [
               
              //  ];
              //  if (!validDomains.includes(domain)) return false;
     
               return true;
             }
           )
           .test(
             "valid-email",
             applanguage === "eng"
               ? "Invalid email format"
               : "تنسيق البريد الإلكتروني غير صالح",
             (value) => {
               if (!value) return false;
           
               value = value.toLowerCase().trim();
           
               const emailRegex =
                 /^[a-z0-9](?!.*[._-]{2})[a-z0-9._-]*[a-z0-9]@[a-z0-9-]+\.[a-z]{2,}$/;
           
               return emailRegex.test(value);
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
           ),
      // .transform((value) => (value ? value.toLowerCase().trim() : value)),

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
  });

export default signupSchema;
