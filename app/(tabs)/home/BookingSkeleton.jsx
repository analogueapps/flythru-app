import React from "react";
import { View } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const BookingSkeleton = () => {
  return (
    <View className="p-3 rounded-2xl flex-col gap-y-6 w-[90%] m-auto">
      {/* Header Row */}
      <View className="flex flex-row justify-between items-center mb-5 mt-7 gap-2">
        <View className="flex flex-row items-center gap-4">
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ height: 24, width: 96, borderRadius: 6 }}
            shimmerColors={["#f0f0f0", "#e0e0e0", "#f0f0f0"]}
          />
        </View>

        <View className="items-end">
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ height: 20, width: 80, borderRadius: 6, marginBottom: 8 }}
          />
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ height: 16, width: 112, borderRadius: 6 }}
          />
        </View>
      </View>

      {/* Pickup & Dropoff */}
      <View className="flex flex-row gap-x-5 items-start w-[90%] m-auto">
        <View className="h-24 w-2 bg-gray-300 mt-3 rounded-full" />

        <View className="flex-col gap-5">
          <View className="gap-2">
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ height: 20, width: 96, borderRadius: 6 }}
            />
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ height: 16, width: 192, borderRadius: 6 }}
            />
          </View>

          <View className="gap-2">
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ height: 20, width: 96, borderRadius: 6 }}
            />
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ height: 16, width: 144, borderRadius: 6 }}
            />
          </View>
        </View>
      </View>

      <View className="h-[1px] w-[75%] mx-auto bg-gray-300 mt-4" />

      {/* Swipe Button */}
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{ height: 48, width: "95%", borderRadius: 999, marginTop: 16, alignSelf: "center" }}
      />
    </View>
  );
};

export default BookingSkeleton;
