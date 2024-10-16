import React, { useState } from "react";
import UserContext from "./UserContext";
import { FETCH_AVATER_ROUTE } from "../../constants";

const AvatarContextProvider = ({ children }) => {
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // To manage loading state

  const fetchAvatars = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
         FETCH_AVATER_ROUTE
      );
      const result = await response.json();
      if (result.success && result.statusCode === 200) {
        setAvatars(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch avatars:", error);
    } finally {
      setIsLoading(false); // Loading completed
    }
  };

  return (
    <UserContext.Provider value={{ avatars, fetchAvatars, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default AvatarContextProvider;
