import crypto from "crypto";

// Function to generate an 8-character random code
const randomCryptoVerificationCode = () => {
  return crypto.randomBytes(4).toString("hex").slice(0, 8);
};

// Function to return the expiration time (1 day from now)
const oneDayExpiryTime = () => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000); // Returns a Date object for 1 day later
};

export { randomCryptoVerificationCode, oneDayExpiryTime };
