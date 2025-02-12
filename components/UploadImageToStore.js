import { v2 as cloudinary } from "cloudinary";

export const uploadImageTostore = async () => {
  cloudinary.config({
    cloud_name: "dzzkzubs0",
    api_key: process.env.EXPO_PUBLIC_APPLICATION_KEY_ID,
    api_secret: process.env.EXPO_PUBLIC_APPLICATION_KEY_SECRET,
  });

  const uploadResult = await cloudinary.uploader
    .upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg", {
      public_id: "avatar",
    })
    .catch((error) => {
      console.log(error);
    });

  console.log(uploadResult);

  const optimizeUrl = cloudinary.url("avatar", {
    fetch_format: "auto",
    quality: "auto",
  });

  console.log(optimizeUrl);

  const autoCropUrl = cloudinary.url("avatar", {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });

  console.log(autoCropUrl);
};
