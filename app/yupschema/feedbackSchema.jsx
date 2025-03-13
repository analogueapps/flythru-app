import * as Yup from "yup";

const feedbackSchema = Yup.object().shape({
    ratingStars: Yup.string()
    .required("Please fill required fields"), 

    comment: Yup.string()
 
  .required("Please fill required fields"),
});

export default feedbackSchema
