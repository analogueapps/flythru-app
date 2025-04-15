import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const language = createContext();
export const langaugeContext = () => useContext(language);

export const LanguageContext = ({ children }) => {
  const [applanguage, setLanguage] = useState("eng");

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await AsyncStorage.getItem("appLanguage");
      if (storedLang) { 
        setLanguage(storedLang);
      }
    };
    loadLanguage();
  }, []);

  async function ToogleLanguage(value) {
    setLanguage(value);
    await AsyncStorage.setItem("appLanguage", value);
  }
  return (
    <language.Provider value={{ applanguage, ToogleLanguage }}>
      {children}
    </language.Provider>
  );
};