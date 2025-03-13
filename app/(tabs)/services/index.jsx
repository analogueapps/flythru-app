import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import miniplane from "../../../assets/images/miniplane.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ALL_SERVICES } from "../../network/apiCallers";

const Index = () => {
    const insets = useSafeAreaInsets();
    const [services, setServices] = useState([]);

    const fetchServices = async () => {
        try {
            const res = await ALL_SERVICES();
            console.log("API Response:", res.data);

            if (res?.data?.allServices && Array.isArray(res.data.allServices)) {
                setServices(res.data.allServices);
            } else {
                console.log("Unexpected response format:", res.data);
                setServices([]);
            }
        } catch (error) {
            console.log("Error fetching services:", error);
            setServices([]);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <View className="flex-1">
            {/* Header Background Image */}
            <View>
                <Image
                    source={images.HeaderImg}
                    className="w-full h-auto object-cover"
                /> 
            </View>

            {/* Header Title */}
           <View
                 style={{
                   top: insets.top,
                   zIndex: 1,
                 }}
                 className="p-6 absolute w-full"
               >
                 <View className="flex-row  items-center  mt-5">
                  
                   <Text className="text-[20px] font-bold text-white ml-3" style={{fontFamily: "CenturyGothic"}}>Services</Text>
                 </View>
                
               </View>

            {/* Services List */}
            <ScrollView  
                className="p-4" 
                showsVerticalScrollIndicator={false}
            >
                {services.length > 0 ? (
                    services.map((service) => (
                        <View key={service._id} className="mb-6">
                            {/* Service Title */}
                            <Text className="text-[#164F90] text-2xl font-bold mb-3">
                                {service.title}
                            </Text>

                            {/* Service Description */}
                            <View className="gap-2 px-4">
                                {typeof service.description === 'string'
                                    ? service.description.split('\r\n').map((line, index) => (
                                        <View key={index} className="flex-row items-center">
                                            <Image
                                                source={miniplane}
                                                className="h-5 w-5 mr-2"
                                                resizeMode="contain"
                                            />
                                            <Text className="text-[#515151] text-base font-light">
                                                {line}
                                            </Text>
                                        </View>
                                    ))
                                    : null}
                            </View>

                            {/* Book Now Button */}
                            <TouchableOpacity
                                className="bg-[#FFB800] rounded-xl py-4 mt-4 shadow-md active:opacity-80"
                                activeOpacity={0.8}
                            >
                                <Text className="text-center text-black font-semibold text-lg">
                                    Book Now
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text className="text-center text-gray-500 text-lg mt-5">
                        No services available
                    </Text>
                )}
            </ScrollView>
        </View>
    );
};

export default Index;
