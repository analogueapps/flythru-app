import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const SuccessModal = ({ visible, onClose,heading = "Successfully Done" , message = "Your order has been successfully placed. Thank you for choosing us." }) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 w-[80%] items-center">
         <TouchableOpacity
            className="border rounded-full p-1 self-end"
            onPress={onClose}
          >
            <AntDesign name="close" size={20} color="black" />
          </TouchableOpacity>

          <Text className="text-[#35A120] text-2xl mb-3 font-bold" style={{ fontFamily: "Lato" }}>{heading}</Text>
          <Text
            className="text-[18px] font-semibold text-center mb-4"
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
