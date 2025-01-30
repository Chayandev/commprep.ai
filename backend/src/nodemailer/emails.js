import { ApiError } from "../utils/apiHandler/exports.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./email.templates.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (
  recipientEmail,
  verificationCode
) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME, // Sender email address
      to: recipientEmail,
      subject: "Verify your email address",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationCode
      ),
    };

    // Send the email and capture the response
    const info = await transporter.sendMail(mailOptions);

    // Log the email response
    console.log("Email sent successfully: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new ApiError(
      409,
      `Error sending verification email: ${error.message}`
    );
  }
};
