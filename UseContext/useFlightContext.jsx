import React, { createContext, useState, useContext } from "react";

const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  const [departureDate, setDepartureDate] = useState("");

  return (
    <FlightContext.Provider value={{ departureDate, setDepartureDate }}>
      {children}
    </FlightContext.Provider>
  );
};

export const useFlightContext = () => useContext(FlightContext);
