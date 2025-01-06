/* eslint-disable no-unused-vars */
import { useState,useEffect } from "react";
import { PostList } from "../cmps/PostList";
import { useSelector } from 'react-redux'
import { loadPosts } from "../store/actions/post.actions";
import { postService } from "../services/post.service";


export function FeedIndex() {

    const [ filterBy, setFilterBy ] = useState(postService.getDefaultFilter())

    const posts = useSelector(storeState => storeState.postModule.posts)
    const user = useSelector(storeState => storeState.userModule.user)
    console.log('user', user)

    console.log('posts', posts)
    useEffect(() =>{
        loadPosts(filterBy)
    },[filterBy])
    return (
        <div className="feed">
          <h1>Instagram Homepage</h1>
          <PostList posts={posts} />
        </div>
      );
}