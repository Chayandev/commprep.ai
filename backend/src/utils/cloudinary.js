import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (
  localFilePath,
  folder = "commprep.ai_audios",
  tags = []
) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to the specified folder in Cloudinary
    const uploadOptions = {
      resource_type: "auto",
      folder: folder,
    };

    if (Array.isArray(tags) && tags.length > 0) {
      uploadOptions.tags = tags;
    }

    const response = await cloudinary.uploader.upload(
      localFilePath,
      uploadOptions
    );

    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  } finally {
    // Safely remove the locally saved temporary file
    if (localFilePath && fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (unlinkError) {
        console.error("Error unlinking local temp file:", unlinkError);
      }
    }
  }
};

export { uploadOnCloudinary, cloudinary };


