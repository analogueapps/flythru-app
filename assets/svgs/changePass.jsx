import * as React from "react";
import Svg, { Rect, Mask, Path, G } from "react-native-svg";

const ChangePassword = (props) => (
   <Svg width={40} height={40} viewBox="0 0 30 30" fill="none">
    <Rect width={30} height={30} rx={15} fill="#164F90" fillOpacity={0.1} />
    <Mask id="mask0" maskUnits="userSpaceOnUse" x={6} y={6} width={18} height={18}>
      <Rect x={6} y={6} width={18} height={18} fill="#D9D9D9" />
    </Mask>
    <G mask="url(#mask0)">
      <Path
        d="M7.5 20.25V18.75H22.5V20.25H7.5ZM8.3625 15.7125L7.3875 15.15L8.025 14.025H6.75V12.9H8.025L7.3875 11.8125L8.3625 11.25L9 12.3375L9.6375 11.25L10.6125 11.8125L9.975 12.9H11.25V14.025H9.975L10.6125 15.15L9.6375 15.7125L9 14.5875L8.3625 15.7125ZM14.3625 15.7125L13.3875 15.15L14.025 14.025H12.75V12.9H14.025L13.3875 11.8125L14.3625 11.25L15 12.3375L15.6375 11.25L16.6125 11.8125L15.975 12.9H17.25V14.025H15.975L16.6125 15.15L15.6375 15.7125L15 14.5875L14.3625 15.7125ZM20.3625 15.7125L19.3875 15.15L20.025 14.025H18.75V12.9H20.025L19.3875 11.8125L20.3625 11.25L21 12.3375L21.6375 11.25L22.6125 11.8125L21.975 12.9H23.25V14.025H21.975L22.6125 15.15L21.6375 15.7125L21 14.5875L20.3625 15.7125Z"
        fill="#164F90"
      />
    </G>
  </Svg>
);

export default ChangePassword;
