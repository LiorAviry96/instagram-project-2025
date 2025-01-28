/* eslint-disable react/prop-types */
import { useState } from "react";
import { uploadService } from "../services/upload.service";
import { MediaIconSvg } from "./svg/MediaIconSvg";
export function ImgUploader({ onUploaded = null }) {
  const [imgData, setImgData] = useState({
    imgUrl: null,
    height: 500,
    width: 500,
  });

  const [isUploading, setIsUploading] = useState(false);

  async function uploadImg(ev) {
    setIsUploading(true);
    const { secure_url, height, width } = await uploadService.uploadImg(ev);
    setImgData({ imgUrl: secure_url, width, height });
    setIsUploading(false);
    onUploaded?.(secure_url);
  }

  function getUploadLabel() {
    if (imgData.imgUrl) return "Upload Another?";
    return isUploading ? "Uploading...." : "Select from computer";
  }

  return (
    <div className="upload-preview">
      {imgData.imgUrl && (
        <img
          src={imgData.imgUrl}
          style={{ maxWidth: "200px", float: "right" }}
        />
      )}
      <div className="icon-and-text">
        <MediaIconSvg className="media-icon" />
        <h4>Drag Photos here</h4>
      </div>

      <label htmlFor="imgUpload">{getUploadLabel()}</label>
      <input type="file" onChange={uploadImg} accept="img/*" id="imgUpload" />
    </div>
  );
}
