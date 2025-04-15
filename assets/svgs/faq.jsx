import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"
const Faq = (props) => (
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
      d="M19.069 20.35c.77-1.39 2.25-2.21 3.11-3.44.91-1.29.4-3.7-2.18-3.7-1.69 0-2.52 1.28-2.87 2.34l-2.59-1.09c.71-2.13 2.64-3.96 5.45-3.96 2.35 0 3.96 1.07 4.78 2.41.7 1.15 1.11 3.3.03 4.9-1.2 1.77-2.35 2.31-2.97 3.45-.25.46-.35.76-.35 2.24h-2.89c-.01-.78-.13-2.05.48-3.15Zm2.93 7.15c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2Z"
    />
  </Svg>
)
export default Faq
