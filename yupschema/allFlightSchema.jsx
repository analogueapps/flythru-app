import * as Yup from "yup";

export const AllflightSchema = (applanguage) =>
  Yup.object().shape({
    departureDate: Yup.string()
  .matches(/^[a-zA-Z0-9\s\-\/]*$/, "Date should not contain special characters")
  .required("Departure date is required"),

    flightNumber: Yup.string()
    .required("Flight Number is required")
    .min(
      4,
      applanguage === "eng"
        ? "Flight number must be at least 4 characters"
        : "يجب أن يتكون رقم الرحلة من 4 أحرف على الأقل"
       
    )
    .max(
      8,
      applanguage === "eng"
        ? "Flight number must be at most 8 characters"
        : "يجب ألا يتجاوز رقم الرحلة 8 أحرف")

        .matches(
          /^(?!.* {2,})[A-Za-z0-9- ]*$/,
          "No consecutive spaces are allowed"
        )

        .test(
              "not-only-spaces",
              applanguage === "eng"
                ? "Input cannot be only spaces"
                : "لا يمكن أن يكون الإدخال مسافات فقط",
              (value) => value && value.trim().length > 0
            )
    .matches(/^[A-Za-z0-9-]*$/, "Only letters, numbers, and hyphens are allowed")
    ,
  }).test(
    "at-least-one-required",
    applanguage === "eng"
      ? "Either Departure Date or Flight Number is required"
      : "مطلوب إما تاريخ المغادرة أو رقم الرحلة",
    (values) => values.departureDate || values.flightNumber
  );
 