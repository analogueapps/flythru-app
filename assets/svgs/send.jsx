import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"
const Send = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Rect
      width={24}
      height={24}
      x={0.5}
      y={0.5}
      fill="#283E71"
      fillOpacity={0.1}
      rx={12}
    />
    <Path
      fill="#0C0C0C"
      d="m8.49 8.17 5.006 2.147-5.013-.667.006-1.48Zm5 5.813L8.482 16.13v-1.48l5.006-.667ZM7.155 6.15l-.007 4.667 10 1.333-10 1.333.007 4.667 13.993-6-13.993-6Z"
    />
  </Svg>
)
export default Send
