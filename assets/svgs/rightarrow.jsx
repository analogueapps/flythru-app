import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Rightarrow = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={8}
    height={12}
    fill="none"
    {...props}
  >
    <Path
      fill="#515151"
      d="m1 9.875 3.88-3.88L1 2.115A.996.996 0 1 1 2.41.705L7 5.295c.39.39.39 1.02 0 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0c-.38-.39-.39-1.03 0-1.42Z"
    />
  </Svg>
)
export default Rightarrow
