import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
const PlaneIcon = (props: SvgProps) => (
  <Svg width={34} height={35} fill="none" {...props}>
    <Path
      fill="#F9F9F9"
      d="M10.333 34.167h3.334L22 20h9.167c1.383 0 2.5-1.117 2.5-2.5s-1.117-2.5-2.5-2.5H22L13.667.833h-3.334L14.5 15H5.333l-2.5-4.167h-2.5L2 17.5.333 24.167h2.5L5.333 20H14.5l-4.167 14.167Z"
    />
  </Svg>
);
export default PlaneIcon;
