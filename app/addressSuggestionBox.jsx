import React, { useState, useEffect } from "react";
import { ALL_ADDRESS } from "../network/apiCallers";

const AddressSuggestionBox = () => {
  const [addresses, setAddresses] = useState([]);
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch addresses from API
  const fetchAddress = async () => {
    try {
      const res = await ALL_ADDRESS();
      console.log("Response address", res.data);

      if (res?.data?.addresses && Array.isArray(res.data.addresses)) {
        setAddresses(res.data.addresses);
      } else {
        console.log("Unexpected response format:", res);
        setAddresses([]);
      }
    } catch (error) {
      console.log("Error fetching addresses:", error);
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  // Filter addresses based on search input
  useEffect(() => {
    if (search) {
      const filtered = addresses.filter((addr) =>
        addr.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredAddresses(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [search, addresses]);

  return (
    <div className="relative w-80 mx-auto mt-6">
      {/* Search Input */}
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Dropdown Suggestions */}
      {showDropdown && filteredAddresses.length > 0 && (
        <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {filteredAddresses.map((addr, index) => (
            <li
              key={index}
              className="p-3 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                setSearch(addr);
                setShowDropdown(false);
              }}
            >
              {addr}
            </li>
          ))}
        </ul>
      )}

      {/* No Results */}
      {showDropdown && filteredAddresses.length === 0 && (
        <div className="absolute w-full mt-1 p-3 bg-white border border-gray-300 rounded-lg shadow-lg text-gray-500">
          No addresses found
        </div>
      )}
    </div>
  );
};

export default AddressSuggestionBox;
