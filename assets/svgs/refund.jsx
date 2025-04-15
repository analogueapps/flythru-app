import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"
const Refund = (props) => (
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
      d="M25.645 14.35a7.958 7.958 0 0 0-5.65-2.35c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08a5.99 5.99 0 0 1-5.65 4c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L20.995 19h7v-7l-2.35 2.35Z"
    />
  </Svg>
)
export default Refund
