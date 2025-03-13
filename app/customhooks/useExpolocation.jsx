import { StyleSheet,View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location'

const useExpoLocation = () => {
  const [errorMsg,setErrorMsg] = useState('')
  const [latitude,setLatitude] = useState('')
  const [longitude,setLongitude] = useState('')

  const getUserLocation = async()=>{
    let {status} = await Location.requestForegroundPermissionsAsync();

    if(status != 'granted'){
      setErrorMsg('Permition to location form not granted')
      return
    }
    let {coords} = await Location.getCurrentPositionAsync();
     if(coords){
      let {latitude,longitude} = coords;
      console.log(coords);
      setLatitude(latitude)
      setLongitude(longitude)
     
      
      console.log("User Location");
     }
     

   }
   useEffect(()=>{
    getUserLocation()
   },[])

   return {latitude,longitude,errorMsg,getUserLocation}
 
}

export default useExpoLocation