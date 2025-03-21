import * as Yup from "yup";

const baggageSchema = Yup.object().shape({
  personsCount: Yup.number().required("Number of persons is required"),
  baggageCount: Yup.number().required("Number of bags is required"),
  baggagePictures: Yup.array()
    .of(Yup.string())
    .min(1, "At least one image is required") // Optional - Require at least one image
    .max(5, "You can upload up to 5 images"), // Optional - Limit the number of images
});

export default baggageSchema;
