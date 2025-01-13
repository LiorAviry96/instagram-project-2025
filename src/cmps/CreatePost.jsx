/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { ImgUploader } from "./ImgUploader";
import { updateUserImage } from "../store/actions/user.actions";
import { useState } from "react";
import { useNavigate } from 'react-router'
import { userService } from "../services/user.service";
import { makeId } from "../services/util.service";
import { createPost } from "../store/actions/post.actions";
import { useSelector } from "react-redux";


export function CreatePost({ onClose }) {
    const [imgUrl, setImgUrl] = useState("")
    const [postText, setPostText] = useState(""); 
    const navigate = useNavigate()
    const user = useSelector((storeState) => storeState.userModule.user);

    async function onUpadteImages(ev = null) {
        if (ev) ev.preventDefault();
        if (!imgUrl) return console.error('Invalid image URL');

        try {

            await updateUserImage(imgUrl);
            console.log('Image uploaded successfully');
            let postId =  makeId()

            const newPost = {
                txt: postText,
                imgUrl,
                owner: {
                    _id:  userService.getLoggedinUser()._id,
                    fullname:  userService.getLoggedinUser().fullname,
                    imgeUrl:  userService.getLoggedinUser().imgUrl,
                },
                comment: [],
                likedBy: [],
                createdAt: new Date().toISOString(),
            };

            await createPost(newPost);
            onClose(); 
            console.log('Post created successfully');
            navigate('/');
        } catch (err) {
            console.error('Failed to update user image or create post:', err);
        }

    }
    function onUploaded(imgUrl) {
        setImgUrl(imgUrl)
    }
    return (

            <div className="upload-item">
                <form onSubmit={onUpadteImages}>
                <ImgUploader onUploaded={onUploaded}/>
                <textarea
                    value={postText}
                    onChange={(ev) => setPostText(ev.target.value)}
                    placeholder="Write something about your image..."
                />
                <button className="uploadSubmit">Submit</button>
                </form>
                
                
            </div>


    )
}