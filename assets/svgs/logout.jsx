import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"
const Logout = (props) => (
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
      d="m25 16-1.41 1.41L25.17 19H17v2h8.17l-1.58 1.58L25 24l4-4-4-4Zm-12-3h7v-2h-7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2h-7V13Z"
    />
  </Svg>
)
export default Logout
