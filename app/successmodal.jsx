import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const SuccessModal = ({ visible, onClose, heading = "Successfully Done", message = "Your order has been successfully placed. Thank you for choosing us.",type='success'}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="relative bg-white rounded-2xl p-6 pt-4 w-[80%] max-w-[300px] items-center">
          <TouchableOpacity
            className="absolute top-2 right-3  rounded-full p-1"
            onPress={onClose}
          >
            <AntDesign name="closecircleo" size={24} color="black" />
          </TouchableOpacity>

          <Text className={`${type == 'success'? 'text-[#35A120]':type == 'info'?'text-blue-600':'text-red-600'} text-2xl mb-6 font-bold`} style={{ fontFamily: "Lato" }}>{heading}</Text>
          <Text
            className="text-[13px] font-semibold text-center mb-4"
            style={{ fontFamily: "Lato" }}
          >
            {message}
          </Text>

        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
