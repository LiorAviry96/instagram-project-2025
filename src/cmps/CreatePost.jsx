/* eslint-disable no-unused-vars */
import { ImgUploader } from "./ImgUploader";
import { updateUserImage } from "../store/actions/user.actions";
import { useState } from "react";
import { useNavigate } from 'react-router'

export function CreatePost() {
    const [imgUrl, setImgUrl] = useState("")
    const navigate = useNavigate()

    async function onUpadteImages(ev = null) {
        if (ev) ev.preventDefault()
        if (!imgUrl) return console.error('Invalid image URL');
        try {
            await updateUserImage(imgUrl);
            console.log('Image uploaded successfully');
        } catch (err) {
            console.error('Failed to update user image:', err);
        }
        navigate('/')
    }
    function onUploaded(imgUrl) {
        setImgUrl(imgUrl)
    }
    return (

            <div className="gallery-item">
                <form onSubmit={onUpadteImages}>
                <ImgUploader onUploaded={onUploaded}/>
                <button className="uploadSubmit">Submit</button>
                </form>
                
                
            </div>


    )
}