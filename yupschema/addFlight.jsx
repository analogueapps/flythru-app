import * as Yup from "yup";

const addFlightSchema = (applanguage) =>
  Yup.object().shape({
    flight_from: Yup.string()
      .required(
        applanguage === "eng" ? "This field is required" : "هذا الحقل مطلوب"
      )
    ,

    flight_to: Yup.string()
      .required(
        applanguage === "eng" ? "This field is required" : "هذا الحقل مطلوب"
      ),

    dep_date: Yup.string()
      .required(
        applanguage === "eng"
          ? "This field is required" : "هذا الحقل مطلوب"
      ),
    
      dep_time: Yup.string()
      .required(
        applanguage === "eng"
          ? "This field is required" : "هذا الحقل مطلوب"
      ),
      flight_time: Yup.string()
      .required(
        applanguage === "eng"
          ? "This field is required" : "هذا الحقل مطلوب"
      ),
      flight_number: Yup.string()
      .required(
        applanguage === "eng"
          ? "This field is required" : "هذا الحقل مطلوب"
      )
     
    
     
  });

export default addFlightSchema;
