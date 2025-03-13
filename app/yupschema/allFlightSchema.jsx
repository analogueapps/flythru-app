import * as Yup from "yup";

const AllflightSchema = Yup.object().shape({
    departureDate: Yup.string()
    .required("Email is required"), 

    flightNumber: Yup.string()
 
  .required("Password is required"),
});

export default AllflightSchema
