import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"
const Chat = (props) => (
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
      d="M12 12h16v12H13.17L12 25.17V12Zm0-2c-1.1 0-1.99.9-1.99 2L10 30l4-4h14c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2H12Zm2 10h8v2h-8v-2Zm0-3h12v2H14v-2Zm0-3h12v2H14v-2Z"
    />
  </Svg>
)
export default Chat
