import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Cancel2 from '../assets/svgs/cancel2';
const CustomAlert = ({
  title,
  titleColor = '#000000',
  message = '',
  button1Title = '',
  button1bgColor = '#FFB648',
  button1Color = "#ffffff",
  button1Action = () => { },
  button2Title = '',
  button2Color = '#ffffff',
  button2bgColor = '#FFB648',
  button2Action = () => { },
  cancelEnable='',
  cancelAction = () => { }
}) => {
  return (
    <View className=' h-screen fixed top-0 left-0 z-[1000] justify-center items-center bg-[rgba(0,0,0,0.4)]'>
      <View className='w-full relative w-min-[350px] mx-2 p-3 bg-white max-w-[300px] rounded-lg'>
          {cancelEnable == 'true' && <TouchableOpacity onPress={cancelAction} className='z-10 absolute top-3 right-3'>
            <Cancel2 />
            </TouchableOpacity>}
        <Text className={` text-[25px] text-center font-bold`} style={{ fontFamily: "Lato", color: `${titleColor}` }}>{title}</Text>
        <Text className='text-[#404040] text-center mt-3' style={{ fontFamily: "Lato" }}>{message}</Text>

        <View className='flex flex-row justify-center gap-4 mt-3'>
          {button1Title && (
            <TouchableOpacity
              className={` px-4 p-1  max-w-[100px] rounded-md`}
              style={{ backgroundColor: button1bgColor }}
              onPress={button1Action}
            >
              <Text className={` text-center  font-semibold`} style={{ color: button1Color }}>{button1Title}</Text>
            </TouchableOpacity>
          )}

          {button2Title && (
            <TouchableOpacity
              className={` px-4 p-1  max-w-[100px] rounded-md`}
              style={{ backgroundColor: button2bgColor }}
              onPress={button2Action}
            >
              <Text className={`  text-center  font-semibold`} style={{ color: button2Color }}>{button2Title}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

export default CustomAlert;
