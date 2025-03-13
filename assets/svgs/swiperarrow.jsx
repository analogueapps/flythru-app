import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Swiperarrow = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Path fill="#FFB648" d="m8 15 7-7-7-7" />
    <Path
      stroke="#08203C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m8 15 7-7-7-7"
    />
    <Path fill="#08203C" d="M1 8h14H1Z" />
    <Path
      stroke="#08203C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1 8h14"
    />
  </Svg>
)
export default Swiperarrow
