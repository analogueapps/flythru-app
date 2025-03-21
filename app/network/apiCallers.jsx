import axios from "axios";
import { BASE_URL, LOCAL_URL } from "./environment";
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.log('Error saving token:', error);
  }
};


export const SIGN_UP_API = async (data) => {
  try {
    const res = await axios.post(`${LOCAL_URL}/user/register`, data);
    const token = res?.data?.token;
    
    if (token) {
      await saveToken(token); 
    }

    return res;
  } catch (error) {
    console.log('Signup Error:', error);
    throw error;
  }
};

export const LOGIN_API = async (data) => {
  try {
    const res = await axios.post(`${LOCAL_URL}/user/login`, data);
    const token = res?.data?.token;
    
    if (token) {
      await saveToken(token); 
    }

    return res;
  } catch (error) {
    console.log('Login Error:', error);
    throw error;
  }
};

export const VERIFY_OTP = async (data,token) => {
  console.log()
  return await axios.post(`${LOCAL_URL}/user/verifyotp`,data,{

      headers: {
          'Authorization': `Bearer ${token}`,
      }
  })

}

export const CANCELLATION = async (data,token) => {
  console.log()
  return await axios.post(`${LOCAL_URL}/payment/cancelbooking`,data,{

      headers: {
          'Authorization': `Bearer ${token}`,
      }
  })

}

export const EDIT_PROFILE = async (data,token) => {
  console.log()
  return await axios.post(`${LOCAL_URL}/user/editprofile`,data,{

      headers: {
          'Authorization': `Bearer ${token}`,
      }
  })

}

export const DELETE_ADDRESS = async (addressId, token) => {
  console.log("Deleting address:", addressId);

  return await axios.post(
    `${LOCAL_URL}/user/deleteaddress`,
    { addressId }, // Just send the ID
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};

export const BOOKING_DETAILS = async (bookingId, token) => {
  console.log("FETCHING BOOKING DETAILS:", bookingId);

  return await axios.get(
    `${LOCAL_URL}/payment/bookings/${bookingId}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};




export const PAYEMNT_API = async (data,token) => {
  console.log("PAYMENT API FETCHED")
  return await axios.post(`${LOCAL_URL}/payment/createorder`,data,{

      headers: {
          'Authorization': `Bearer ${token}`,
      }
  })

}


  export const ALL_FLIGHTS = async (data) => {
    console.log("Fetched All flights")
    return await axios.post(`${LOCAL_URL}/allflights`,data) 
  }

  export const ALL_BANNERS = async () => {
    // console.log("banners fetched")
  
    return await axios.get(`${LOCAL_URL}/allbanners`, {
     
    })
  }

  export const ALL_SERVICES = async () => {
    // console.log("services")
  
    return await axios.get(`${LOCAL_URL}/allservices`, {
     
    })
  }
  

  export const ALL_SETTINGS = async () => {
    // console.log("settings fetched")
  
    return await axios.get(`${LOCAL_URL}/allsettings`, {
     
    })
  }
  

  export const ALL_FAQS = async () => {
    console.log("faqs fetched")
  
    return await axios.get(`${LOCAL_URL}/allfaqs`, {
     
    })
  }

  export const ALL_USERS = async () => {
    console.log("users fetched")
  
    return await axios.get(`${LOCAL_URL}/allusers`, {
     
    })
  }
  
  export const CONTACT_US = async () => {
    console.log("contact usssss fetched")
  
    return await axios.get(`${LOCAL_URL}/allcontactus`, {
     
    })
  }

  export const ALL_ADDRESS = async () => {
    console.log("Fetched All address")
    return await axios.get(`${LOCAL_URL}/user/alladdress`,) 
  }

  export const ALL_TIME_SLOTS = async (data) => {
    console.log("Fetched All time slots")
    return await axios.get(`${LOCAL_URL}/user/timeslots`,data) 
  }

  export const FEEDBACK = async (data,token) => {
    console.log()
    return await axios.post(`${LOCAL_URL}/user/feedback`,data,{

        headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data',
        }
    })

  }
  
  export const ADD_ADDRESS = async (data,token) => {
    console.log()
    return await axios.post(`${LOCAL_URL}/user/address`,data,{

        headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data',
        }
    })

  }
  