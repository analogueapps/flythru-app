import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"
const Homecal = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Rect width={24} height={24} fill="#194F90" fillOpacity={0.1} rx={6} />
    <Path
      fill="#194F90"
      d="M8.667 11.333H10v1.334H8.667v-1.334ZM18 8v9.333c0 .734-.6 1.334-1.333 1.334H7.333c-.74 0-1.333-.6-1.333-1.334L6.007 8c0-.733.586-1.333 1.326-1.333H8V5.333h1.333v1.334h5.334V5.333H16v1.334h.667C17.4 6.667 18 7.267 18 8ZM7.333 9.333h9.334V8H7.333v1.333Zm9.334 8v-6.666H7.333v6.666h9.334ZM14 12.667h1.333v-1.334H14v1.334Zm-2.667 0h1.334v-1.334h-1.334v1.334Z"
    />
  </Svg>
)
export default Homecal
