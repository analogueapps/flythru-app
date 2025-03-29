import * as Yup from "yup";

export const AllflightSchema = (applanguage) =>
  Yup.object().shape({
    departureDate: Yup.string(),
    flightNumber: Yup.string(),
  }).test(
    "at-least-one-required",
    applanguage === "eng"
      ? "Either Departure Date or Flight Number is required"
      : "مطلوب إما تاريخ المغادرة أو رقم الرحلة",
    (values) => values.departureDate || values.flightNumber
  );
