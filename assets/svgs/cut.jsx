import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Cut = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Path
      fill="#000"
      d="m6.856 6.146 3.146 3.147 3.146-3.147.707.708L10.71 10l3.146 3.146-.707.708-3.146-3.147-3.146 3.147-.708-.708L9.295 10 6.148 6.854l.708-.708Z"
    />
    <Path
      fill="#000"
      fillRule="evenodd"
      d="M20.002 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10Zm-1 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default Cut
