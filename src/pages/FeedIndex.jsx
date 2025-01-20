/* eslint-disable no-unused-vars */
import { useState,useEffect } from "react";
import { useSelector } from 'react-redux'
import { loadStorys } from "../store/actions/story.actions";
import { useDispatch } from 'react-redux';
import { StoryList } from "../cmps/StoryList";


export function FeedIndex() {
  const dispatch = useDispatch();


    const storys = useSelector(storeState => storeState.storyModule.storys)
    const user = useSelector(storeState => storeState.storyModule.user)
    console.log('storys', storys)
    
    useEffect(() =>{
        loadStorys()
    },[dispatch])
    return (
        <div className="feed">
          <StoryList storys={storys} />
        </div>
      );
}