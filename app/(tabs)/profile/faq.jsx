import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { ALL_FAQS } from "../../network/apiCallers";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const FAQ = () => {
  const insets = useSafeAreaInsets();
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  const fetchFaqs = async () => {
    try {
      const res = await ALL_FAQS();
      console.log("ressss faq", res.data);

      if (res?.data?.allFaqs && Array.isArray(res.data.allFaqs)) {
        setFaqs(res.data.allFaqs);
      } else {
        console.log("Unexpected response format:", res.data);
        setFaqs([]);
      }
    } catch (error) {
      console.log("Error fetching FAQs:", error);
      setFaqs([]);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <View className="flex-1">
      {/* Header Background Image */}
      <View>
        <Image
          source={images.HeaderImg}
          className="w-full h-auto relative" 
          style={{ resizeMode: "cover" }}
        />
      </View>

      {/* Header */}
      <View
        style={{
          top: insets.top,
          zIndex: 1,
        }}
        className="p-6 absolute w-full "
      >
        <View className="flex-row items-center mt-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
          >
            <ChevronLeft color="black" size={18} />
          </TouchableOpacity>
          <Text
            className="text-[18px] text-white ml-3"
            style={{ fontFamily: "CenturyGothic" }}
          >
            FAQ
          </Text>
        </View>
      </View>

      {/* Scrollable FAQ Content */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
        {faqs.length > 0 ? (
          faqs.map((faq, index) => (
            <View
              key={faq._id}
              className="mb-6 border-b border-gray-300 p-4 rounded-lg"
            >
              {/* FAQ Question */}
              <TouchableOpacity
                className="flex-row justify-between items-center"
                onPress={() => toggleAnswer(index)}
              >
                <Text className="text-[16px] font-bold text-[#164F90]">
                  {faq.question}
                </Text>
                {openIndex === index ? (
                  <Entypo name="minus" size={24} color="#164F90" />
                ) : (
                  <FontAwesome6 name="plus" size={24} color="#164F90" />
                )}
              </TouchableOpacity>

              {/* FAQ Answer */}
              {openIndex === index && (
                <View className="mt-2 px-4">
                  {typeof faq.answer === "string"
                    ? faq.answer.split("\r\n").map((line, lineIndex) => (
                        <Text
                          key={lineIndex}
                          className="text-[#515151] text-base font-light"
                        >
                          {line}
                        </Text>
                      ))
                    : null}
                </View>
              )}
            </View>
          ))
        ) : (
          <Text className="text-center text-gray-500 text-lg mt-5">
            No FAQs available
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default FAQ;
