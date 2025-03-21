import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, TextInput } from "react-native";
import React, { useRef, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Delete } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import dp from "../../../assets/images/dpfluthru.jpg"
import { Calendar } from "lucide-react-native";
import Editprofile from "../../../assets/svgs/editprofile";
import Rightarrow from "../../../assets/svgs/rightarrow";
import Addaddress from "../../../assets/svgs/addaddress";
import Language from "../../../assets/svgs/language";
import Contactus from "../../../assets/svgs/contactus";
import Chat from "../../../assets/svgs/chat";
import Faq from "../../../assets/svgs/faq";
import Feedback from "../../../assets/svgs/feedback";
import Terms from "../../../assets/svgs/terms";
import Privacy from "../../../assets/svgs/privacy";
import Cancel from "../../../assets/svgs/cancel";
import Refund from "../../../assets/svgs/refund";
import Logout from "../../../assets/svgs/logout";
import DeleteIcon from "../../../assets/svgs/delete";
import RBSheet from 'react-native-raw-bottom-sheet';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";




const index = () => {

    const insets = useSafeAreaInsets();
    const drefRBSheet = useRef();
    const logoutrefRBSheet = useRef();
    const [current, setCurrent] = useState("1");
    
    const handleLogout = () => {
      return (
        <RBSheet
          ref={logoutrefRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={Dimensions.get('window').height / 3}
        
        
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0,0,0,0.2)", 
            },
             
            container: {
              backgroundColor: "#fff",
              borderTopLeftRadius: 20, 
              borderTopRightRadius: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: -3, // Lift shadow upwards
              },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5, // For Android shadow
            },
            draggableIcon: {
              backgroundColor: "#ccc",
              width: 40,
              height: 5,
              borderRadius: 10,
            },
          }}
        >
          <View className="p-3 rounded-2xl flex-col gap-y-6">
            <Text className="text-center border-b-[1px] border-[#E0E0E0] py-3 text-2xl font-bold">
              Logout
            </Text>
    
            <Text className="text-center text-xl font-bold">
            Are you sure you want to Logout ?
                        </Text>
    
    
    
            <View className="mx-6 flex flex-col gap-3">
              <Text className="text-[#40464C] text-center">Lorem ipsum is a placeholder text commonly used to demonstrate the visual.</Text>
    
            </View>
    
    <View className="flex flex-row justify-center">
   
               <TouchableOpacity className=" my-4 mx-4 border-2 border-[#164F90] rounded-xl py-4 px-10 "
               onPress={() => logoutrefRBSheet.current.close()}>
                       <Text className="text-center text-[#164F90] font-semibold">Now Now</Text>
                     </TouchableOpacity>
              
   
                <TouchableOpacity
                className=" my-4 mx-4 bg-[#FFB800] rounded-xl py-4 px-10 shadow-lg"
                        onPress={() => router.push("/(auth)")}
                
                >
                       <Text className="text-center text-black font-semibold">Yes Logout</Text>
                     </TouchableOpacity>
               </View>
          </View>
        </RBSheet>
      );
    };
    
    

        const handleDelete = () => {
          return (
            <RBSheet
              ref={drefRBSheet}
              closeOnDragDown={true}
              closeOnPressMask={true}
              height={Dimensions.get('window').height / 1.4}
              customStyles={{
                wrapper: {
                  backgroundColor: "rgba(0,0,0,0.2)", 
                },
                 
                container: {
                  backgroundColor: "#fff",
                  borderTopLeftRadius: 20, 
                  borderTopRightRadius: 20,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: -3, // Lift shadow upwards
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 5, // For Android shadow
                },
                draggableIcon: {
                  backgroundColor: "#ccc",
                  width: 40,
                  height: 5,
                  borderRadius: 10,
                },
              }}
            >
              <View className="p-3 rounded-2xl flex-col gap-y-6">
                <Text className="text-center border-b-[1px] border-[#E0E0E0] py-3 text-2xl font-bold">
                  Delete Account
                </Text>
        
                <Text className="text-center text-xl font-bold">
                  Give Reason to Delete your Account.
                </Text>
        
                {/* Centering the RadioButtonGroup */}
                <View className=" items-center py-4">
                  <RadioButtonGroup
                    containerStyle={{ marginBottom: 10 }}
                    selected={current}
                    onSelected={(value) => setCurrent(value)}
                    radioBackground="#4E4848"
                  >
                    <RadioButtonItem
                      value="1"
                      label={
                        <Text style={{ color: "#181716", fontSize: 17, fontWeight: "100" }}>
                          Service is Not Good
                        </Text>
                      }
                    />
        
                    <View className="h-3"></View>
        
                    <RadioButtonItem
                      value="2"
                      label={
                        <Text style={{ color: "#181716", fontSize: 17, fontWeight: "100" }}>
                          No Proper Customer Care
                        </Text>
                      }
                    />
        
                    <View className="h-3"></View>
        
                    <RadioButtonItem
                      value="3"
                      label={
                        <Text style={{ color: "#181716", fontSize: 17, fontWeight: "100" }}>
                          Driver is Rude
                        </Text>
                      }
                    />
        
                    <View className="h-3"></View>
        
                    <RadioButtonItem
                      value="4"
                      label={
                        <Text style={{ color: "#181716", fontSize: 17, fontWeight: "100" }}>
                          Poor user experience
                        </Text>
                      }
                    />
                  </RadioButtonGroup>
                </View>
        
                <View className="mx-6 flex flex-col gap-3">
                  <Text className="text-[#40464C]">Other reason (Please specify)</Text>
        
                  <TextInput
                    numberOfLines={7}
                    className="bg-white rounded-lg p-3 border-[#EDF1F3] border-[1px]"
                    placeholder="Type here..."
                    textAlignVertical="top"
                    placeholderTextColor={"#1A1C1E"}
                  />
                </View>
        
                <TouchableOpacity className="my-4 mx-12 bg-[#FFB800] rounded-xl py-4 mb-14 shadow-lg">
                  <Text className="font-bold text-center text-black">Delete Account</Text>
                </TouchableOpacity>
              </View>
            </RBSheet>
          );
        };
        
    
    
    return (
      <View className="flex-1">
    {/* Header Background Image */}
    {handleDelete()}
    {handleLogout()}
    <View> 
      <Image
        source={images.HeaderImg}
        className="w-full h-auto relative"
        style={{ resizeMode: "cover" }}
      />
    </View>
    <View
      style={{
        top: insets.top,
        zIndex: 1,
      }}
      className="p-6 absolute w-full"
    >
      <View className="flex-row  items-center  mt-5">
       
        <Text className="text-[20px] font-bold text-white ml-3" style={{fontFamily: "CenturyGothic"}}>Profile</Text>
      </View>
     
    </View>
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

      <View className="px-4">


      <TouchableOpacity className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
        onPress={() => router.push("/profile/editprofile")}
      >
        <View className="flex-row gap-3 items-center">
        <Editprofile/>
        <Text className="text-[#515151] text-xl">Edit Profile</Text>
        </View>
        <Rightarrow/>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
        onPress={() => router.push("/profile/address")}

      >
        <View className="flex-row gap-3 items-center">
        <Addaddress/>
        <Text className="text-[#515151] text-xl">Add Address</Text>
        </View>
        <Rightarrow/>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
              onPress={() => router.push("/profile/language")}
      >
        <View className="flex-row gap-3 items-center">
        <Language/>
        <Text className="text-[#515151] text-xl">Language</Text>
        </View>
        <Rightarrow/>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
              onPress={() => router.push("/profile/contactus")}
      >
        <View className="flex-row gap-3 items-center">
        <Contactus/>
        <Text className="text-[#515151] text-xl">Contact Us</Text>
        </View>
        <Rightarrow/>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
                    onPress={() => router.push("/profile/chat")}

      >
        <View className="flex-row gap-3 items-center">
        <Chat/>
        <Text className="text-[#515151] text-xl">Chat With Support Team</Text>
        </View>
        <Rightarrow/>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
              onPress={() => router.push("/profile/faq")}

      >
        <View className="flex-row gap-3 items-center">
        <Faq/>
        <Text className="text-[#515151] text-xl">FAQ</Text>
        </View>
        <Rightarrow/>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
                    onPress={() => router.push("/profile/feedback")}

      >
        <View className="flex-row gap-3 items-center">
        <Feedback/>
        <Text className="text-[#515151] text-xl">Feedback</Text>
        </View>
        <Rightarrow/>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
                    onPress={() => router.push("/profile/termsandconditions")}
      >
        <View className="flex-row gap-3 items-center">
        <Terms/>
        <Text className="text-[#515151] text-xl">Terms And Conditions</Text>
        </View>
        <Rightarrow/>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
           onPress={() => router.push("/profile/privacypolicy")}

      >
        <View className="flex-row gap-3 items-center">
        <Privacy/>
        <Text className="text-[#515151] text-xl">Privacy Policy</Text>
        </View>
        <Rightarrow/>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
                 onPress={() => router.push("/profile/cancellationpolicy")}

      >
        <View className="flex-row gap-3 items-center">
        <Cancel/>
        <Text className="text-[#515151] text-xl">Cancellation Policy</Text>
        </View>
        <Rightarrow/>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
                 onPress={() => router.push("/profile/refundpolicy")}
      >
        <View className="flex-row gap-3 items-center">
        <Refund/>
        <Text className="text-[#515151] text-xl">Refund Policy</Text>
        </View>
        <Rightarrow/>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
      onPress={() => drefRBSheet.current.open()}
      >
        <View className="flex-row gap-3 items-center">
        <DeleteIcon/>
        <Text className="text-[#515151] text-xl">Delete Account</Text>
        </View>
        <Rightarrow/>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => logoutrefRBSheet.current.open()}
>
        <View className="flex-row gap-3 items-center">
        <Logout/>
        <Text className="text-[#515151] text-xl">Logout</Text>
        </View>
        <Rightarrow/>
      </TouchableOpacity>

      </View> 
    </ScrollView>
  </View>
  );
};

export default index;
 