import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

const CustomAlert = ({ visible=false, title, message, onClose }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className='' style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text className='text-[#164E8D]' style={styles.title}>{title}</Text>
          <Text className='mb-5 text-[14px]'>{message}</Text>

          <Pressable className='bg-[#FFB648] rounded-md' onPress={onClose} style={styles.okButton}>
            <Text className='text-[#164E8D] font-semibold text-[16px]' >OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  alertBox: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    width: 300,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  message: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  okButton: { paddingVertical: 8, paddingHorizontal: 20 },
  okText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
});
