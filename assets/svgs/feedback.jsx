import * as React from "react"
import Svg, { Rect, Mask, Path, G } from "react-native-svg"
const Feedback = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <Rect width={40} height={40} fill="#164F90" fillOpacity={0.1} rx={20} />
    <Mask
      id="a"
      width={24}
      height={24}
      x={8}
      y={8}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <Path fill="#D9D9D9" d="M8 8h24v24H8z" />
    </Mask>
    <G mask="url(#a)">
      <Path
        fill="#164F90"
        d="M14 22h3.05l5-5a1.538 1.538 0 0 0 .45-1.075c0-.183-.042-.362-.125-.537a2.073 2.073 0 0 0-.325-.488l-.9-.95a1.504 1.504 0 0 0-1.637-.337 1.483 1.483 0 0 0-.513.337l-5 5V22Zm1.5-1.5v-.95l2.525-2.525.5.45.45.5L16.45 20.5h-.95Zm3.025-3.025.45.5-.95-.95.5.45Zm.65 4.525H26v-2h-4.825l-2 2ZM10 30V12c0-.55.196-1.02.588-1.412A1.926 1.926 0 0 1 12 10h16c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412v12c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 28 26H14l-4 4Zm3.15-6H28V12H12v13.125L13.15 24Z"
      />
    </G>
  </Svg>
)
export default Feedback
