import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const SimpleBookingButton = ({ onPress, title = "Book Now" }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePress = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000); // Reset after 3 seconds
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        width: '95%',
        height: 50,
        backgroundColor: showConfirm ? '#4CAF50' : '#FFB648',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
      }}
      activeOpacity={0.8}
    >
      <AntDesign
        name={showConfirm ? "check" : "arrowright"} 
        size={24} 
        color="#164F90" 
        style={{ marginRight: 8 }}
      />
      <Text
        style={{
          fontSize: 16,
          color: '#164F90',
          fontWeight: 'bold',
        }}
      >
        {showConfirm ? 'Tap Again to Confirm' : title}
      </Text>
    </TouchableOpacity>
  );
};