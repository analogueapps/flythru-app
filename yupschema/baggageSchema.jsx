import * as Yup from "yup";

export const baggageSchema = (applanguage) =>
  Yup.object().shape({
    personsCount: Yup.number().required(
      applanguage === "eng"
        ? "Number of persons is required"
        : "عدد الأشخاص مطلوب"
    ),
    baggageCount: Yup.number().required(
      applanguage === "eng"
        ? "Number of bags is required"
        : "عدد الحقائب مطلوب"
    ),
    baggagePictures: Yup.array()
      .of(Yup.string())
      // .min(
      //   1,
      //   applanguage === "eng"
      //     ? "At least one image is required"
      //     : "مطلوب صورة واحدة على الأقل"
      // )
      .max(
        10,
        applanguage === "eng"
          ? "You can upload up to 10 images"
          : "يمكنك رفع ما يصل إلى 10 صور"
      ),
  });
