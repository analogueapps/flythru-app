import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"
const Editprofile = (props) => (
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
      d="m24.81 15.94-3.75-3.75L12 21.25V25h3.75l9.06-9.06ZM14 23v-.92l7.06-7.06.92.92L14.92 23H14ZM27.71 13.04a.996.996 0 0 0 0-1.41l-2.34-2.34a1.001 1.001 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83ZM30 27H10v4h20v-4Z"
    />
  </Svg>
)
export default Editprofile
