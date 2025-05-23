import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"
const DeleteIcon = (props) => (
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
      d="M24 17v10h-8V17h8Zm-1.5-6h-5l-1 1H13v2h14v-2h-3.5l-1-1Zm3.5 4H14v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V15Z"
    />
  </Svg>
)
export default DeleteIcon
