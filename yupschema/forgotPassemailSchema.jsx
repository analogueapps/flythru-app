import * as Yup from "yup";

const forgotpassemailSchema = (applanguage) =>
  Yup.object().shape({
    

    email: Yup.string()
      .required(
        applanguage === "eng" ? "Email is required" : "البريد الإلكتروني مطلوب"
      ),

   
    
     
  });

export default forgotpassemailSchema;
