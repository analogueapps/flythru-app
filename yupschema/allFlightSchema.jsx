import * as Yup from "yup";

export const AllflightSchema = (applanguage) =>
  Yup.object().shape({
    // departureDate: Yup.string()
    //   .matches(/^[a-zA-Z0-9\s\-\/]*$/, applanguage === "eng"
    //     ? "Date should not contain special characters"
    //     : "يجب ألا يحتوي التاريخ على رموز خاصة")
    //   .required(applanguage === "eng"
    //     ? "Departure date is required"
    //     : "تاريخ المغادرة مطلوب"),
    // departureTime: Yup.string()
    //   .matches(/^[a-zA-Z0-9\s\-\/]*$/, applanguage === "eng"
    //     ? "Departure Time should not contain special characters"
    //     : "يجب ألا يحتوي وقت المغادرة على رموز خاصة")
    //   .required(applanguage === "eng"
    //     ? "Departure Time is required"
    //     : "وقت المغادرة مطلوب"),

    flightNumber: Yup.string()
      .matches(/\d/, applanguage === "eng"
        ? "Flight number must contain at least one digit"
        : "يجب أن يحتوي رقم الرحلة على رقم واحد على الأقل")

      // .min(
      //   3,
      //   applanguage === "eng"
      //     ? "Flight number must be at least 3 characters"
      //     : "يجب أن يتكون رقم الرحلة من 3 أحرف على الأقل"
      // )
      // .max(
      //   6,
      //   applanguage === "eng"
      //     ? "Flight number must be at most 6 characters"
      //     : "يجب ألا يتجاوز رقم الرحلة 6 أحرف"
      // )
      // .matches(
      //   /^(?!.* {2,})[A-Za-z0-9- ]*$/,
      //   applanguage === "eng"
      //     ? "Only letters, numbers, hyphens allowed; no consecutive spaces"
      //     : "يسمح فقط بالأحرف والأرقام والشرطات؛ لا توجد مسافات متتالية"
      // )
      // .test(
      //   "not-only-spaces",
      //   applanguage === "eng"
      //     ? "Input cannot be only spaces"
      //     : "لا يمكن أن يكون الإدخال مسافات فقط",
      //   (value) => {
      //     if (!value) return true; // allow empty (optional)
      //     return value.trim().length > 0;
      //   }
      // )
      // ,
  }).test(
    "at-least-one-required",
    applanguage === "eng"
      ? "Either Departure Date or Flight Number is required"
      : "مطلوب إما تاريخ المغادرة أو رقم الرحلة",
    (values) => values.departureDate?.trim() || values.flightNumber?.trim()
  );
