/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const PostContext = createContext();

export function PostProvider({ children }) {
  const [srcImg, setSrcImg] = useState("");

  const getImageSrc = (image) => {
    if (!image) {
      console.error("Image source is not available");
      return "";
    }

    if (typeof image === "string") {
      return image.startsWith("http")
        ? image
        : `/src/assets/images/${image}.jpeg`;
    }

    if (typeof image === "object" && image.imgUrl) {
      return image.imgUrl.startsWith("http")
        ? image.imgUrl
        : `/src/assets/images/${image.imgUrl}.jpeg`;
    }

    console.error("Invalid image format");
    return "";
  };

  return (
    <PostContext.Provider value={{ srcImg, setSrcImg, getImageSrc }}>
      {children}
    </PostContext.Provider>
  );
}
