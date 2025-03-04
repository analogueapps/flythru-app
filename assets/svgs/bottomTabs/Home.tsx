import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHome = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" viewBox="0 0 23 20" {...props}>
    <Path
      fill={props.color}
      d="m11.765 3.165 5.882 5.294v9.188h-2.353v-7.059H8.235v7.06H5.882v-9.19zM12.099.3a.5.5 0 0 0-.669 0L.968 9.717a.5.5 0 0 0 .335.871h2.226V19.5a.5.5 0 0 0 .5.5h6.06a.5.5 0 0 0 .5-.5v-6.559h2.352V19.5a.5.5 0 0 0 .5.5H19.5a.5.5 0 0 0 .5-.5v-8.912h2.226a.5.5 0 0 0 .335-.871z"
    />
  </Svg>
);
export default SvgHome;
