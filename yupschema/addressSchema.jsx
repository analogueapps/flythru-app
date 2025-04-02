import * as Yup from "yup";

const addaddresSchema = (applanguage) =>
  Yup.object().shape({
    addressData: Yup.string()
      .required(
        applanguage === "eng"
          ? "This field is required"
          : "هذا الحقل مطلوب"
      )
      .min(
        5,
        applanguage === "eng"
          ? "Address must be at least 5 characters long"
          : "يجب أن يتكون العنوان من 5 أحرف على الأقل"
      )
      .max(
        100,
        applanguage === "eng"
          ? "Address cannot exceed 100 characters"
          : "لا يمكن أن يتجاوز العنوان 100 حرف"
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
        2,
        applanguage === "eng"
          ? "City must be at least 2 characters long"
          : "يجب أن يتكون اسم المدينة من حرفين على الأقل"
      )
      .max(
        50,
        applanguage === "eng"
          ? "City cannot exceed 50 characters"
          : "لا يمكن أن يتجاوز اسم المدينة 50 حرفًا"
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
        2,
        applanguage === "eng"
          ? "State must be at least 2 characters long"
          : "يجب أن يتكون اسم الولاية من حرفين على الأقل"
      )
      .max(
        50,
        applanguage === "eng"
          ? "State cannot exceed 50 characters"
          : "لا يمكن أن يتجاوز اسم الولاية 50 حرفًا"
      ),

    postalCode: Yup.string()
      .required(
        applanguage === "eng"
          ? "Postal code is required"
          : "الرمز البريدي مطلوب"
      )
      .matches(
        /^[a-zA-Z0-9\s\-]+$/,
        applanguage === "eng"
          ? "Postal code can only contain letters, numbers, spaces, and hyphens"
          : "يمكن أن يحتوي الرمز البريدي على أحرف وأرقام ومسافات وشرطات فقط"
      )
      .min(
        3,
        applanguage === "eng"
          ? "Postal code must be at least 3 characters long"
          : "يجب أن يتكون الرمز البريدي من 3 أحرف على الأقل"
      )
      .max(
        10,
        applanguage === "eng"
          ? "Postal code cannot exceed 10 characters"
          : "لا يمكن أن يتجاوز الرمز البريدي 10 أحرف"
      ),

    locationName: Yup.string()
      .required(
        applanguage === "eng"
          ? "Location name is required"
          : "اسم الموقع مطلوب"
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
