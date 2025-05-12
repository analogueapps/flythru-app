import * as Yup from "yup";

const addaddresSchema = (applanguage) =>
  Yup.object().shape({
    addressData: Yup.string()
      .required(
        applanguage === "eng"
          ? "Address is required"
          : "العنوان مطلوب"
      )
      .min(
        3,
        applanguage === "eng"
          ? "Address must be at least 3 characters long"
          : "يجب أن يتكون العنوان من 3 أحرف على الأقل"
      )
      .max(
        50,
        applanguage === "eng"
          ? "Address cannot exceed 50 characters"
          : "لا يمكن أن يتجاوز العنوان 50 حرف"
      )
      .matches(
        /^(?=.*[a-zA-Z])(?!.*[@#$%^&*()<>])(?!^\d+$)[a-zA-Z0-9\s\/\-.,#]+$/,
        applanguage === "eng"
          ? "Address must include letters, allow numbers, and special characters like /-.,# but not @#$%^&*()<> and cannot be only numbers"
          : "يجب أن يحتوي العنوان على أحرف ويمكن أن يحتوي على أرقام ورموز مثل /-.,# ولا يمكن أن يحتوي على @#$%^&*()<> ولا يمكن أن يكون أرقامًا فقط"
      ),

    city: Yup.string()
      .required(
        applanguage === "eng"
          ? "City is required"
          : "اسم المدينة مطلوب"
      )
      .matches(
        /^[a-zA-Z\s\-']+$/,
        applanguage === "eng"
          ? "City can only contain letters, spaces, hyphens, and apostrophes"
          : "يمكن أن يحتوي اسم المدينة على أحرف، مسافات، شرطات، وعلامات اقتباس فقط"
      )
      .min(
        3,
        applanguage === "eng"
          ? "City must be at least 3 characters long"
          : "يجب أن يتكون اسم المدينة من 3 أحرف على الأقل"
      )
      .max(
        20,
        applanguage === "eng"
          ? "City cannot exceed 20 characters"
          : "لا يمكن أن يتجاوز اسم المدينة 20 حرفًا"
      ),

    state: Yup.string()
      .required(
        applanguage === "eng"
          ? "State is required"
          : "اسم الولاية مطلوب"
      )
      .matches(
        /^[a-zA-Z\s\-']+$/,
        applanguage === "eng"
          ? "State can only contain letters, spaces, hyphens, and apostrophes"
          : "يمكن أن يحتوي اسم الولاية على أحرف، مسافات، شرطات، وعلامات اقتباس فقط"
      )
      .min(
        3,
        applanguage === "eng"
          ? "State must be at least 3 characters long"
          : "يجب أن يتكون اسم الولاية من 3 أحرف على الأقل"
      )
      .max(
        20,
        applanguage === "eng"
          ? "State cannot exceed 20 characters"
          : "لا يمكن أن يتجاوز اسم الولاية 20 حرفًا"
      ),

    postalCode: Yup.string()
      .required(
        applanguage === "eng"
          ? "Postal code is required"
          : "الرمز البريدي مطلوب"
      )
      
      .matches(
        /^[0-9]+$/,
        applanguage === "eng"
          ? "Postal code can only contain numbers"
          : "يمكن أن يحتوي الرمز البريدي على أرقام فقط"
      )
      .min(
        5,
        applanguage === "eng"
          ? "Postal should be exactly 5 digits"
          : "يجب أن يتكون الرمز البريدي من 5 أرقام"
      )
    ,

    locationName: Yup.string()
      .required(
        applanguage === "eng"
          ? "Location name is required"
          : "اسم الموقع مطلوب"
      )
      .matches(/^(?=.*[A-Za-z])[A-Za-z0-9\s]*$/, "Must contain letters")
      .matches(
        /^(?!.*[!@#$%^&*()_+={}\[\]:;"'<>,.?~`\\|\/-]).*$/,
        applanguage === "eng"
          ? "Location name cannot contain special characters"
          : "لا يمكن أن يحتوي اسم الموقع على رموز خاصة"
      )

      .matches(
        /^[a-zA-Z0-9\s\-.,#]+$/,
        applanguage === "eng"
          ? "Location name can only contain letters, numbers, spaces, hyphens, periods, commas, and hashes"
          : "يمكن أن يحتوي اسم الموقع على أحرف وأرقام ومسافات وشرطات ونقاط وفواصل وعلامات هاش فقط"
      )
      .min(
        2,
        applanguage === "eng"
          ? "Location name must be at least 2 characters long"
          : "يجب أن يتكون اسم الموقع من حرفين على الأقل"
      )
      .max(
        50,
        applanguage === "eng"
          ? "Location name cannot exceed 50 characters"
          : "لا يمكن أن يتجاوز اسم الموقع 50 حرفًا"
      ),
  });

export default addaddresSchema;
