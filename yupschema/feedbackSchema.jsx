import * as Yup from "yup";

const feedbackSchema = (applanguage) =>
  Yup.object().shape({
    ratingStars: Yup.string().required(
      applanguage === "eng"
        ? "Please fill required fields"
        : "يرجى ملء الحقول المطلوبة"
    ),

    comment: Yup.string().required(
      applanguage === "eng"
        ? "Please fill required fields"
        : "يرجى ملء الحقول المطلوبة"
    ),
  });

export default feedbackSchema;
