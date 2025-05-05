import axios from "axios";

// Custom translate function
const TranslateText = async (text, targetLang = "en") => {
  const apiKey = "AIzaSyAT9u5lqHcYWUgr7BlVStg58ocUNKBSWt0"; // Make sure to store securely
  const url = "https://translation.googleapis.com/language/translate/v2";

  try {
    const res = await axios.post(
      url,
      {},
      {
        params: {
          q: text,
          target: targetLang, // Use 'en' or 'ar' as language code
          key: apiKey,
        },
      }
    );

    return res.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original text in case of error
  }
};

export default TranslateText;