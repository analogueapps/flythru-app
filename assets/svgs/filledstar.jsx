import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Filledstar = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Path
      fill="#FFC319"
      stroke="#164F90"
      strokeWidth={0.5}
      d="m4.257 17.334-.085.5.448-.236 4.88-2.566 4.88 2.566.448.236-.085-.5-.932-5.433 3.948-3.849.362-.353-.501-.073-5.456-.793-2.44-4.944-.224-.454-.224.454-2.44 4.944-5.456.793-.501.073.363.353 3.947 3.849-.932 5.433Z"
    />
  </Svg>
)
export default Filledstar
