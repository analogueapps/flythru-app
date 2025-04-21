import * as Yup from "yup";

const delaccSchema = (applanguage) =>
  Yup.object().shape({
    reasonForDeleteAccount: Yup.string()
      .required(
        applanguage === "eng"
          ? "Reason for deletion is required"
          : "سبب الحذف مطلوب"
      )
      .test(
        "not-only-spaces",
        applanguage === "eng"
          ? "Input cannot be only spaces"
          : "لا يمكن أن يكون الإدخال مسافات فقط",
        (value) => value && value.trim().length > 0
      ),
  });

export default delaccSchema;
