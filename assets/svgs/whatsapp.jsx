import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const Whatsappicon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <G
      stroke="#181716"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      clipPath="url(#a)"
    >
      <Path d="m3 21 1.65-3.8a9 9 0 1 1 3.4 2.9L3 21Z" />
      <Path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 1 0-1 0v1Zm0 0a5 5 0 0 0 5 5m0 0h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default Whatsappicon
