import * as Yup from "yup";

const slotsSchema = (applanguage) =>
  Yup.object().shape({
    date: Yup.string().required(
      applanguage === "eng" ? "Date is required" : "التاريخ مطلوب"
    ),

    time: Yup.string().required(
      applanguage === "eng" ? "Time is required" : "الوقت مطلوب"
    ),
  });

export default slotsSchema;
