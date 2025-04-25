import axios from "axios";
import { BASE_URL, LOCAL_URL, AVIATION_URL, API_KEY } from "./environment";
import AsyncStorage from "@react-native-async-storage/async-storage";

const aviationApi = axios.create({
  baseURL: BASE_URL,
  params: {
    access_key: API_KEY,
  },
});

export const getFutureFlights = async (iataCode, flightType, date) => {
  try {
    const response = await aviationApi.get("/flightsFuture", {
      params: {
        iataCode,
        type: flightType,
        date,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching future flights:", error);
    throw error;
  }
};

const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem("authToken", token);
  } catch (error) {
    console.log("Error saving token:", error);
  }
};

const saveUserId = async (userId) => {
  try {
    await AsyncStorage.setItem("authUserId", userId);
  } catch (error) {
    console.log("Error saving token:", error);
  }
};

export const SIGN_UP_API = async (data) => {
  try {
    const res = await axios.post(`${LOCAL_URL}/user/register`, data);
    const token = res?.data?.token;
    const userId = res?.data?.userId

    if (token && userId) {
      await saveToken(token);
      await saveUserId(userId);
    }

    return res;
  } catch (error) {
    console.log("Signup Error:", error);
    throw error;
  }
};

export const LOGIN_API = async (data) => {
  try {
    const res = await axios.post(`${LOCAL_URL}/user/login`, data);
    const token = res?.data?.token;
    const userId = res?.data?.userId

    if (token && userId) {
      await saveToken(token);
      await saveUserId(userId);

      
    }

    return res;
  } catch (error) {
    console.log("Login Error:", error);
    throw error;
  }
};

export const VERIFY_OTP = async (data, token) => {
  console.log();
  return await axios.post(`${LOCAL_URL}/user/verifyotp`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const OAUTH = async (token) => {
  console.log("firebase oath token from api", token);
  return await axios.post(`${LOCAL_URL}/user/oauth`,token);
};

export const LOGOUT = async (token) => {
  console.log("LOGGED OUT SUCCESSFULLY");
  return await axios.post(`${LOCAL_URL}/user/userlogout`,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const RESEND_OTP = async (token) => {
  console.log("token in api calls for resend otp", token);
  return await axios.post(`${LOCAL_URL}/user/resendotp`, {},{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const CANCELLATION = async (data, token, bookingId) => {
  return await axios.post(
    `${LOCAL_URL}/payment/cancelbooking`,
    { ...data, bookingId }, // 👈 Combine data and bookingId in the body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const EDIT_PROFILE = async (data, token) => {
  console.log();
  return await axios.post(`${LOCAL_URL}/user/editprofile`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const DELETE_ADDRESS = async (addressId, token) => {
  console.log("Deleting address:", addressId);

  return await axios.post(
    `${LOCAL_URL}/user/deleteaddress`,
    { addressId }, // Just send the ID
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const BOOKING_DETAILS = async (bookingId, token) => {
  console.log("FETCHING BOOKING DETAILS:", bookingId);

  return await axios.get(`${LOCAL_URL}/payment/bookings/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const NOTIFICATION = async (userId ) => {
  console.log("FETCHING NOTIFICATIONS USERID:", userId);

  return await axios.get(`${LOCAL_URL}/usernotifications/${userId}`);
};

export const ACTIVITIES = async (token) => {
  console.log("FETCHING ACTIVITIES:");

  return await axios.get(`${LOCAL_URL}/payment/activebookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const PAYEMNT_API = async (data, token) => {
  console.log("CREATE ORDER API FETCHED",data,token);
  return await axios.post(`${LOCAL_URL}/payment/createorder`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const DELETE_ACCOUNT = async (data, token) => {
  console.log("DELETE ACCOUNT API FETCHED");
  return await axios.post(`${LOCAL_URL}/user/deleteaccount`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};



export const VERIFY_ORDER = async (orderId , paymentId) => {
  console.log("verify params details", orderId , paymentId);

  const data = {
    orderId: orderId, 
    paymentId: paymentId
  };
  return await axios.post(
    `${LOCAL_URL}/payment/bipassed-verifyOrder`,data
  );
};



export const PAYMENT_VERIFICATION_API = async (data) => {
  console.log("PAYMENT API FETCHED");
  return await axios.post(`${LOCAL_URL}/payment/bipassed-verifyOrder`, data);
};

export const ALL_FLIGHTS = async (data) => {
  console.log("Fetched All flights");
  return await axios.post(`${LOCAL_URL}/allflights`, data);
};

export const ALL_FLIGHTS_CLIENT = async (data) => {
  console.log("Fetched client's All flights");
  return await axios.get(`${LOCAL_URL}/flights/allfights`, data);
};

export const ALL_BANNERS = async () => {
  // console.log("banners fetched")

  return await axios.get(`${LOCAL_URL}/allbanners`, {});
};

export const ALL_SERVICES = async () => {
  // console.log("services")

  return await axios.get(`${LOCAL_URL}/allservices`, {});
};

export const ALL_SETTINGS = async () => {
  // console.log("settings fetched")

  return await axios.get(`${LOCAL_URL}/allsettings`, {});
};

export const ALL_FAQS = async () => {
  console.log("faqs fetched");

  return await axios.get(`${LOCAL_URL}/allfaqs`, {});
};

export const ALL_USERS = async () => {
  console.log("users fetched");

  return await axios.get(`${LOCAL_URL}/allusers`, {});
};

export const CONTACT_US = async () => {
  console.log("contact usssss fetched");

  return await axios.get(`${LOCAL_URL}/allcontactus`, {});
};

export const ALL_ADDRESS = async (token) => {
  console.log("Fetched All address");
  return await axios.get(`${LOCAL_URL}/user/alladdresses`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

  );
};

export const ALL_TIME_SLOTS = async (data) => {
  console.log("Fetched All time slots");
  return await axios.get(`${LOCAL_URL}/user/timeslots`, data);
};

export const FEEDBACK = async (data, token) => {
  console.log();
  return await axios.post(`${LOCAL_URL}/user/feedback`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      // 'Content-Type': 'multipart/form-data',
    },
  });
};

export const ADD_ADDRESS = async (data, token) => {
  console.log();
  return await axios.post(`${LOCAL_URL}/user/address`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      // 'Content-Type': 'multipart/form-data',
    },
  });
};
