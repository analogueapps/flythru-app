import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgServices = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 20 20" {...props}>
    <Path
      stroke={props.color}
      strokeWidth={2.4}
      d="M6.348 12.852a.8.8 0 0 1 .8.8V18a.8.8 0 0 1-.8.8H2a.8.8 0 0 1-.8-.8v-4.348a.8.8 0 0 1 .8-.8zm11.652 0a.8.8 0 0 1 .8.8V18a.8.8 0 0 1-.8.8h-4.348a.8.8 0 0 1-.8-.8v-4.348a.8.8 0 0 1 .8-.8zM6.348 1.2a.8.8 0 0 1 .8.8v4.348a.8.8 0 0 1-.8.8H2a.8.8 0 0 1-.8-.8V2a.8.8 0 0 1 .8-.8zM18 1.2a.8.8 0 0 1 .8.8v4.348a.8.8 0 0 1-.8.8h-4.348a.8.8 0 0 1-.8-.8V2a.8.8 0 0 1 .8-.8z"
    />
  </Svg>
);
export default SvgServices;
