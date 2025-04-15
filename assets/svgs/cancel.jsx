import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"
const Cancel = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <Rect width={40} height={40} fill="#164F90" fillOpacity={0.1} rx={20} />
    <Path
      fill="#164F90"
      d="M20 10c-5.53 0-10 4.47-10 10s4.47 10 10 10 10-4.47 10-10-4.47-10-10-10Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Zm3.59-13L20 18.59 16.41 15 15 16.41 18.59 20 15 23.59 16.41 25 20 21.41 23.59 25 25 23.59 21.41 20 25 16.41 23.59 15Z"
    />
  </Svg>
)
export default Cancel
