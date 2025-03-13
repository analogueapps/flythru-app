import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"
const Terms = (props) => (
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
      d="m20 9-9 4v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12v-6l-9-4Zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V20h-7v-5.7l7-3.11v8.8Z"
    />
  </Svg>
)
export default Terms
