import React from "react";
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const AlertModal = ({ onClose, heading = "Alert", message = "Something went wrong"}) => {
  return (
    <Modal transparent animationType="fade" >
            <TouchableWithoutFeedback onPress={onClose}>

      <View className="flex-1 justify-center items-center bg-black/50">
      <TouchableWithoutFeedback>
        <View className="relative bg-white rounded-2xl p-6 pt-4 w-[80%] max-w-[300px] items-center">
          <TouchableOpacity
            className="absolute top-2 right-3  rounded-full p-1"
            onPress={onClose}
          >
            <AntDesign name="closecircleo" size={24} color="black" />
          </TouchableOpacity>

          <Text className='text-[#DF251A] text-2xl mb-6 font-bold' style={{ fontFamily: "Lato" }}>{heading}</Text>
          <Text
            className="text-[13px] font-semibold text-center mb-4"
            style={{ fontFamily: "Lato" }}
          >
            {message}
          </Text>

        </View>
        </TouchableWithoutFeedback>
      </View>
            </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AlertModal;
