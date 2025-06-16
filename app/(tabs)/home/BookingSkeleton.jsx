import { View } from 'react-native';
import React from 'react';

const BookingSkeleton = () => {
  return (
    <View className="p-3 rounded-2xl flex-col gap-y-6 w-[90%] m-auto">
      {/* Header Row */}
      <View className="flex flex-row justify-between items-center mb-5 mt-7 gap-2">
        <View className="flex flex-row items-center gap-4">
          {/* Avatar Placeholder */}
          {/* <View className="h-16 w-16 rounded-full bg-gray-300" /> */}
          <View className="h-6 w-24 bg-gray-300 rounded-md" />
        </View>

        <View className="items-end">
          <View className="h-5 w-20 bg-gray-300 rounded-md mb-2" />
          <View className="h-4 w-28 bg-gray-300 rounded-md" />
        </View>
      </View>

      {/* Pickup & Dropoff */}
      <View className="flex flex-row gap-x-5 items-start w-[90%] m-auto">
        {/* Line */}
        <View className="h-24 w-2 bg-gray-300 mt-3 rounded-full" />

        <View className="flex-col gap-5">
          {/* Pickup */}
          <View className="gap-2">
            <View className="h-5 w-24 bg-gray-300 rounded-md" />
            <View className="h-4 w-48 bg-gray-300 rounded-md" />
          </View>

          {/* Dropoff */}
          <View className="gap-2">
            <View className="h-5 w-24 bg-gray-300 rounded-md" />
            <View className="h-4 w-36 bg-gray-300 rounded-md" />
          </View>
        </View>
      </View>

      {/* Divider */}
      <View className="h-[1px] w-[75%] mx-auto bg-gray-300 mt-4" />

      {/* Swipe Button Placeholder */}
      <View className="h-12 w-[95%] bg-gray-300 rounded-full mx-auto mt-4" />
    </View>
  );
};

export default BookingSkeleton;
