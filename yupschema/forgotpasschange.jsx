import * as Yup from "yup";

const forgotpasschangeSchema = (applanguage) =>
  Yup.object().shape({
    

    email: Yup.string()
      .required(
        applanguage === "eng" ? "Email is required" : "البريد الإلكتروني مطلوب"
      ),
 password: Yup.string()
      .required(
        applanguage === "eng" ? "Password is required" : "كلمة المرور مطلوبة"
      ),
   
       confirmPassword: Yup.string()
      .required(
        applanguage === "eng" ? "Confirm paassword is required" : "كلمة المرور مطلوبة"
      ),
    
     
  });

export default forgotpasschangeSchema;
