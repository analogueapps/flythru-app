import { RefObject } from "react";
import { TextInput, View } from "react-native";

const OTPinput = ({ codes, refs, errorMessages, onChangeCode , onKeyPress }) => {
  return (
    <View className="flex flex-row self-start justify-center mt-8">
      {codes.map((code, index) => (
        <TextInput
          key={index}
          autoComplete="one-time-code"
          enterKeyHint="next"
          keyboardType="numeric"
          className={`text-[16px] h-[50px] w-[62px] rounded-lg bg-[#ededed] mr-4 px-2 py-1 text-center border-[#e0e0e0] focus:bg-white  border focus:border-[#0A80FB] ${
            errorMessages !== undefined
              ? "border border-[#ef4444] text-[#ef4444]"
              : "text-[#000]"
          }`}
          inputMode="numeric"
          onChangeText={(text) => onChangeCode(text, index)}
          value={code}
          maxLength={1}
          ref={refs[index]}
          // onKeyPress={({ nativeEvent: { key } }) => {
          //   if (key === "Backspace" && index > 0) {
          //     // Handling backspace, focus previous input
          //     const prevRef = refs[index - 1];
          //     if (prevRef && prevRef.current) {
          //       onChangeCode("", index - 1);
          //       prevRef.current.focus();
          //     }
          //   }
          // }}

          onKeyPress={(e) => onKeyPress(e, index)}
        />
      ))}
    </View>
  );
};

export default OTPinput;
