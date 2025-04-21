import * as Yup from "yup";

const editprofileSchema = (applanguage) =>
  Yup.object().shape({
    name: Yup.string()
      .required(
        applanguage === "eng" ? "Name is required" : "الاسم مطلوب"
      )
      .matches(
        /^[A-Za-z\s]+$/,
        applanguage === "eng"
          ? "Name can only contain letters and spaces"
          : "يمكن أن يحتوي الاسم على أحرف ومسافات فقط"
      )
      .test(
        "no-special-chars",
        applanguage === "eng"
          ? "Name cannot contain special characters"
          : "لا يمكن أن يحتوي الاسم على رموز خاصة",
        (value) => /^[A-Za-z\s]+$/.test(value)
      )
      .test(
        "no-numbers",
        applanguage === "eng"
          ? "Name cannot contain numbers"
          : "لا يمكن أن يحتوي الاسم على أرقام",
        (value) => /^[^\d]+$/.test(value)
      ),

    email: Yup.string()
      .required(
        applanguage === "eng" ? "Email is required" : "البريد الإلكتروني مطلوب"
      ),

    phoneNumber: Yup.string()
      .required(
        applanguage === "eng"
          ? "Phone number is required"
          : "رقم الهاتف مطلوب"
      )
      .test(
        "no-letters",
        applanguage === "eng"
          ? "Phone number cannot contain letters"
          : "لا يمكن أن يحتوي رقم الهاتف على أحرف",
        (value) => /^[^a-zA-Z]+$/.test(value)
      )
      .test(
        "no-special-chars",
        applanguage === "eng"
          ? "Phone number cannot contain special characters"
          : "لا يمكن أن يحتوي رقم الهاتف على رموز خاصة",
        (value) => /^[0-9]+$/.test(value)
      )
      .matches(
        /^[569]/,
        applanguage === "eng"
        ? "Phone number must start with 5,6,9"
        : "يجب أن يبدأ رقم الهاتف بـ 5،6،9"
      )
      .matches(
        /^\d{8}$/,
        applanguage === "eng"
          ? "Phone number must be exactly 8 digits"
          : "يجب أن يتكون رقم الهاتف من 8 أرقام بالضبط"
      )
    
     
  });

export default editprofileSchema;
