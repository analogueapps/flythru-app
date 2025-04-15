import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgProfile = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      fill={props.color}
      d="M10 2.5c1.375 0 2.5 1.125 2.5 2.5S11.375 7.5 10 7.5A2.507 2.507 0 0 1 7.5 5c0-1.375 1.125-2.5 2.5-2.5M10 15c3.375 0 7.25 1.613 7.5 2.5h-15c.288-.9 4.138-2.5 7.5-2.5m0-15C7.238 0 5 2.238 5 5s2.238 5 5 5 5-2.237 5-5-2.238-5-5-5m0 12.5c-3.338 0-10 1.675-10 5V19a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-1.5c0-3.325-6.662-5-10-5"
    />
  </Svg>
);
export default SvgProfile;
