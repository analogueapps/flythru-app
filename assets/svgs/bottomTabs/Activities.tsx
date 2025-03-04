import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

const SvgActivities = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      fill={props.color}
      d="M17.5 0h-15A2.507 2.507 0 0 0 0 2.5v15C0 18.875 1.125 20 2.5 20h15c1.375 0 2.5-1.125 2.5-2.5v-15C20 1.125 18.875 0 17.5 0m0 17.5h-15v-15h15zM5 8.75h10v2.5H5zm0 3.75h5V15H5zM5 5h10v2.5H5z"
    />
  </Svg>
);
export default SvgActivities;
