import * as Yup from "yup";

const delaccSchema = (applanguage) =>
  Yup.object().shape({
    reasonForDeleteAccount: Yup.number().required(
      applanguage === "eng"
        ? "Reason for deletion is required"
        : "سبب الحذف مطلوب"
    ),
  });

export default delaccSchema;
