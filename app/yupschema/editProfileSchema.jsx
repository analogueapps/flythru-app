import * as Yup from "yup";

const editprofileSchema = Yup.object().shape({
  // Name validations
  name: Yup.string()
    .required("Name is required")
    .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces") // Restrict numbers and special characters
    .test("no-special-chars", "Name cannot contain special characters", (value) =>
      /^[A-Za-z\s]+$/.test(value)
    )
    .test("no-numbers", "Name cannot contain numbers", (value) =>
      /^[^\d]+$/.test(value)
    ),

    email:Yup.string()
    .required("Email is required"),

  // Phone number validations
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[6-9]/, "Phone number must start with 6, 7, 8, or 9") // Must start with 6-9
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits") // Exactly 10 digits
    .test("no-special-chars", "Phone number cannot contain special characters", (value) =>
      /^[0-9]+$/.test(value) // Only numbers allowed
    )
    .test("no-letters", "Phone number cannot contain letters", (value) =>
      /^[^a-zA-Z]+$/.test(value)
    ),
});

export default editprofileSchema;
