import React, { useEffect, useState } from "react";
import { autoLoginUser } from "../../actions/auth.actions";
import UserContext from "./UserContext";

const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // No access token found, try to refresh the token
    const attemptToAutoLogin = async () => {
      try {
        const result = await autoLoginUser();
        console.log(result);
        setIsLoggedIn(true);
        setUsername(result.data?.username);
      } catch (error) {
        setIsLoggedIn(false);
        console.error("Error auto login", error);
      }
    };
    attemptToAutoLogin();
  }, []); // Add navigate to the dependency array

  return (
    <UserContext.Provider
      value={{ isLoggedIn, username, setUsername, setIsLoggedIn }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default AuthContextProvider;
