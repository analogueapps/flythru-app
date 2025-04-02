import * as Yup from "yup";

const selectlocationSchema = (applanguage) =>
  Yup.object().shape({
    pickUpLocation: Yup.string().required(
      applanguage === "eng"
        ? "Pick-up location is required"
        : "موقع الاستلام مطلوب"
    ),

    pickUpTimings: Yup.string().required(
      applanguage === "eng"
        ? "Pick-up timings are required"
        : "وقت الاستلام مطلوب"
    ),

    // If you want to add dropOffLocation later
    // dropOffLocation: Yup.string().required(
    //   applanguage === "eng"
    //     ? "Drop-off location is required"
    //     : "موقع التسليم مطلوب"
    // ),
  });

export default selectlocationSchema;
