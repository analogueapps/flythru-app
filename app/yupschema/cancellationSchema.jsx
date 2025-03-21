import * as Yup from "yup";

const cancellationSchema = Yup.object().shape({
    // bookingId: Yup.number().required("Number of persons is required"),
  reasonForCancellation: Yup.number().required("This field is required"),

});

export default cancellationSchema;
