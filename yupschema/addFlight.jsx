import * as Yup from "yup";

const addFlightSchema = (applanguage) =>
  Yup.object().shape({
    // flight_from: Yup.string()
    //   .required(
    //     applanguage === "eng" ? "This field is required" : "هذا الحقل مطلوب"
    //   )
    // ,

    // flight_to: Yup.string()
    //   .required(
    //     applanguage === "eng" ? "This field is required" : "هذا الحقل مطلوب"
    //   ),

    // dep_date: Yup.string()
    //   .required(
    //     applanguage === "eng"
    //       ? "This field is required" : "هذا الحقل مطلوب"
    //   ),
    
    //   dep_time: Yup.string()
    //   .required(
    //     applanguage === "eng" 
    //       ? "This field is required" : "هذا الحقل مطلوب"
    //   ),
    //   flight_time: Yup.string()
    //   .required(
    //     applanguage === "eng"
    //       ? "This field is required" : "هذا الحقل مطلوب"
    //   ),
      flight_number: Yup.string()
      .matches(/\d/, applanguage === "eng"
        ? "Flight number must contain at least one digit"
        : "يجب أن يحتوي رقم الرحلة على رقم واحد على الأقل")
      // .required(
      //   applanguage === "eng"
      //     ? "This field is required" : "هذا الحقل مطلوب"
      // )
     
    
     
  });

export default addFlightSchema;
