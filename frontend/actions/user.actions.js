import { REGISTER_USER_ROUTE, VERIFY_USER_EMAIL } from "../constants";

// actions/registerUser.js
export const registerUser = async (userData) => {
  try {
    const response = await fetch(REGISTER_USER_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "An error occurred during registration."
      );
    }

    return result;
  } catch (error) {
    throw error;
  }
};

//action/emial-verification
export const verifyUserEmail = async (verificationCode) => {
  try {
    const response = await fetch(VERIFY_USER_EMAIL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verificationCode),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "An error occurred during email verification."
      );
    }
    return result;
  } catch (error) {
    throw error;
  }
};
