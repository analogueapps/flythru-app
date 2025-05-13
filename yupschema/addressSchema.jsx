import * as Yup from "yup";



const addaddresSchema = (applanguage) =>
  Yup.object().shape({
    addressName: Yup.string()
      // .required(
      //   applanguage === "eng"
      //     ? "Address is required"
      //     : "العنوان مطلوب"
      // )
      // .min(
      //   3,
      //   applanguage === "eng"
      //     ? "Address must be at least 3 characters long"
      //     : "يجب أن يتكون العنوان من 3 أحرف على الأقل"
      // )
      // .matches(/^[A-Za-z]/,applanguage === "eng"?"Address must start with an alphabet": "يجب أن يبدأ العنوان بحرف أبجدي")
      .matches(/^(?!.*[.,#@()&_/]{2,}).*$/, applanguage === "eng" ? 'Address cannot have consecutive special characters' : "لا يمكن أن يحتوي العنوان على رموز خاصة متتالية")
      .matches(
        /^(?=.*[a-zA-Z])(?!.*[@#$%^&*()<>])(?!^\d+$)[a-zA-Z0-9\s\/\-.,#]+$/,
        applanguage === "eng"
          ? "Address must include letters, allow numbers, and special characters like /-.,# but not @#$%^&*()<> and cannot be only numbers"
          : "يجب أن يحتوي العنوان على أحرف ويمكن أن يحتوي على أرقام ورموز مثل /-.,# ولا يمكن أن يحتوي على @#$%^&*()<> ولا يمكن أن يكون أرقامًا فقط"
      ).test('no-trailing-space', applanguage === "eng" ? "Address cannot end with a space" : "لا يمكن أن ينتهي العنوان بمسافة", value => value?.charAt(value.length - 1) !== ' '),
    area: Yup.string()
      .required(
        applanguage === "eng"
          ? "Area is required"
          : "المنطقة مطلوبة"
      )
      // .min(
      //   3,
      //   applanguage === "eng"
      //     ? "Area must be at least 3 characters long"
      //     : "يجب أن يحتوي الحقل على 3 أحرف على الأقل"
      // )
      // .matches(/^[A-Za-z]/,applanguage === "eng"?"Area must start with an alphabet": "يجب أن تبدأ المنطقة بحرف أبجدي")
      .matches(/^(?!.*[.,#@()&_/]{2,}).*$/, applanguage === "eng" ? 'Area cannot have consecutive special characters' : "لا يمكن أن تحتوي المنطقة على رموز خاصة متتالية")
      .matches(
        /^(?=.*[a-zA-Z])(?!.*[@#$%^&*()<>])(?!^\d+$)[a-zA-Z0-9\s\/\-.,#]+$/,
        applanguage === "eng"
          ? "Area must include letters, allow numbers, and special characters like /-.,# but not @#$%^&*()<> and cannot be only numbers"
          : "يجب أن تحتوي المنطقة على أحرف، ويسمح بالأرقام والرموز الخاصة مثل /-.,#، ولا يُسمح بالرموز مثل @#$%^&*()<>، ولا يمكن أن تكون أرقامًا فقط"
      ).test('no-trailing-space', applanguage === "eng" ? "Area cannot end with a space" : "لا يمكن أن تنتهي المنطقة بمسافة", value => value?.charAt(value.length - 1) !== ' '),
    block: Yup.string()
      .required(
        applanguage === "eng"
          ? "Block is required"
          : "الحي مطلوبة"
      )
      // .min(
      //   3,
      //   applanguage === "eng"
      //     ? "Block must be at least 3 characters long"
      //     : "يجب أن يتكون الحي من 3 أحرف على الأقل"
      // )
      // .matches(/^[A-Za-z]/,applanguage === "eng"?"Block must start with an alphabet": "يجب أن يبدأ الحي بحرف أبجدي")
      .matches(/^(?!.*[.,#@()&_/]{2,}).*$/, applanguage === "eng" ? 'Block cannot have consecutive special characters' : "لا يمكن أن يحتوي الحي على رموز خاصة متتالية")
      .matches(
        /^(?=.*[a-zA-Z])(?!.*[@#$%^&*()<>])(?!^\d+$)[a-zA-Z0-9\s\/\-.,#]+$/,
        applanguage === "eng"
          ? "Block must include letters, allow numbers, and special characters like /-.,# but not @#$%^&*()<> and cannot be only numbers"
          : "يجب أن يحتوي الحي على أحرف ويسمح بالأرقام والرموز الخاصة مثل /-.,# ولكن لا يسمح بـ @#$%^&*()<> ولا يمكن أن يتكون من أرقام فقط"
      ).test('no-trailing-space', applanguage === "eng" ? "Block cannot end with a space" : "لا يمكن أن ينتهي الحي بمسافة", value => value?.charAt(value.length - 1) !== ' '),
    streetAddress: Yup.string()
      .required(
        applanguage === "eng"
          ? "Street Address is required"
          : "عنوان الشارع مطلوب"
      )
      // .min(
      //   3,
      //   applanguage === "eng"
      //     ? "Street Address must be at least 3 characters long"
      //     : "يجب أن يكون عنوان الشارع مكونًا من 3 أحرف على الأقل"
      // )
      // .matches(/^[A-Za-z]/,applanguage === "eng"?"Street Address must start with an alphabet": "يجب أن يبدأ عنوان الشارع بحرف أبجدي")
      .matches(/^(?!.*[.,#@()&_/]{2,}).*$/, applanguage === "eng" ? 'Street Address cannot have consecutive special characters' : "لا يمكن أن يحتوي عنوان الشارع على أحرف خاصة متتالية")
      .matches(
        /^(?=.*[a-zA-Z])(?!.*[@#$%^&*()<>])(?!^\d+$)[a-zA-Z0-9\s\/\-.,#]+$/,
        applanguage === "eng"
          ? "Street Address must include letters, allow numbers, and special characters like /-.,# but not @#$%^&*()<> and cannot be only numbers"
          : "يجب أن يتضمن عنوان الشارع حروفًا، ويسمح بالأرقام، والأحرف الخاصة مثل /-.,#، ولكن ليس @#$%^&*()<> ولا يمكن أن يكون مكونًا من أرقام فقط"
      ).test('no-trailing-space', applanguage === "eng" ? "Street Address cannot end with a space" : "عنوان الشارع لا يمكن أن ينتهي بمسافة", value => value?.charAt(value.length - 1) !== ' '),
    avenue: Yup.string()
      // .required(
      //   applanguage === "eng"
      //     ? "Avenue is required"
      //     : "الشارع الفرعي مطلوب"
      // )
      // .min(
      //   3,
      //   applanguage === "eng"
      //     ? "Avenue must be at least 3 characters long"
      //     : "الشارع الفرعي يجب أن يكون طوله 3 أحرف على الأقل"
      // )
      // .matches(/^[A-Za-z]/,applanguage === "eng"?"Avenue must start with an alphabet": "الشارع الفرعي يجب أن يبدأ بحرف أبجدي")
      .matches(/^(?!.*[.,#@()&_/]{2,}).*$/, applanguage === "eng" ? 'Avenue cannot have consecutive special characters' : "الشارع الفرعي لا يمكن أن يحتوي على أحرف خاصة متتالية")
      .matches(
        /^(?=.*[a-zA-Z])(?!.*[@#$%^&*()<>])(?!^\d+$)[a-zA-Z0-9\s\/\-.,#]+$/,
        applanguage === "eng"
          ? "Avenue must include letters, allow numbers, and special characters like /-.,# but not @#$%^&*()<> and cannot be only numbers"
          : "يجب أن يتضمن الشارع الفرعي أحرفًا، ويسمح بالأرقام، والأحرف الخاصة مثل /-.,# ولكن ليس @#$%^&*()<> ولا يمكن أن يكون مكونًا من أرقام فقط"
      ).test('no-trailing-space', applanguage === "eng" ? "Avenue cannot end with a space" : "لا يمكن أن ينتهي الشارع الفرعي بمسافة", value => value?.charAt(value.length - 1) !== ' '),
    buildingNumber: Yup.string()
      .required(
        applanguage === "eng"
          ? "Building Number is required"
          : "رقم المبنى مطلوب"
      )
      .test('no-trailing-space', applanguage === "eng" ? "Building Number cannot end with a space" : "لا يمكن أن ينتهي رقم المبنى بمسافة", value => value?.charAt(value.length - 1) !== ' '),
    floorNo: Yup.string()
      // .required(
      //   applanguage === "eng"
      //     ? "Floor No. is required"
      //     : "رقم الطابق مطلوب"
      // )

      .matches(
        /^[0-9]+$/,
        applanguage === "eng"
          ? "Floor No. can only contain numbers"
          : "رقم الطابق يمكن أن يحتوي على أرقام فقط"
      ),
    flatNo: Yup.string()
      // .required(
      //   applanguage === "eng"
      //     ? "Flat No. is required"
      //     : "رقم الشقة مطلوب"
      // )

      .matches(
        /^[0-9]+$/,
        applanguage === "eng"
          ? "Flat No. can only contain numbers"
          : "رقم الشقة يمكن أن يحتوي على أرقام فقط"
      ),
    // .min(
    //   5,
    //   applanguage === "eng"
    //     ? "Postal should be exactly 5 digits"
    //     : "يجب أن يتكون الرمز البريدي من 5 أرقام"
    // )



  });

export default addaddresSchema;
