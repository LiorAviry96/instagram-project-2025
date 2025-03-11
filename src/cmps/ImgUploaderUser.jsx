/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { uploadService } from "../services/upload.service";
export function ImgUploaderUser({ onUploaded = null }) {
  const [imgData, setImgData] = useState({
    imgUrl: null,
    height: 100,
    width: 200,
  });

  const [isUploading, setIsUploading] = useState(false);

  async function uploadImg(ev) {
    setIsUploading(true);
    const { secure_url, height, width } = await uploadService.uploadImg(ev);
    setImgData({ imgUrl: secure_url, width, height });
    setIsUploading(false);
    onUploaded?.(secure_url);
  }

  return (
    <div>
      {imgData.imgUrl && (
        <img src={imgData.imgUrl} style={{ maxWidth: "200px" }} />
      )}

      <input
        className="signup-img"
        type="file"
        onChange={uploadImg}
        accept="img/*"
        id="imgUpload"
      />
    </div>
  );
}
