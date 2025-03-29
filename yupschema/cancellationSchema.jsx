import * as Yup from "yup";

const cancellationSchema = (applanguage) =>
  Yup.object().shape({
    reasonForCancellation: Yup.number().required(
      applanguage === "eng"
        ? "Reason for cancellation is required"
        : "سبب الإلغاء مطلوب"
    ),
  });

export default cancellationSchema;
