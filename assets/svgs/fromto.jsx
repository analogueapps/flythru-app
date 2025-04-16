import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"
const Fromto = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Rect width={24} height={24} fill="#E4EAF0" rx={6} />
    <Path
      fill="#194F90"
      d="m10.982 13.312-1.895 2.012V7.362a.52.52 0 1 0-1.039 0v7.947L6.152 13.31a.52.52 0 0 0-.754.715l2.803 2.953a.52.52 0 0 0 .377.162h.001a.52.52 0 0 0 .377-.163l2.782-2.953a.52.52 0 0 0-.756-.713ZM18.602 9.957l-2.804-2.953a.52.52 0 0 0-.376-.161h-.001a.52.52 0 0 0-.378.163l-2.781 2.953a.52.52 0 1 0 .756.712l1.895-2.011v7.962a.52.52 0 0 0 1.039 0V8.675l1.896 1.998a.52.52 0 0 0 .754-.716Z"
    />
  </Svg>
)
export default Fromto
