import * as Yup from "yup";

const selectlocationSchema = Yup.object().shape({
    pickUpLocation: Yup.string()
    .required("This field is required"), 

  //   dropOffLocation: Yup.string()
 
  // .required("This field is required"),
});

export default selectlocationSchema
