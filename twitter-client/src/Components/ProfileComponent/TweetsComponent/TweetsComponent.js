import React, { useState, useEffect } from 'react'
import './style.css'
import PostComponent from '../../DashboardComponent/PostComponent/PostComponent'
import CircularProgress from '@material-ui/core/CircularProgress';
import Axios from 'axios'
import { useHistory } from 'react-router-dom'
import Config from '../../../Configs'

export default function TweetsComponent() {
    const [userPost, setUsersPost] = useState([])
    const [hideLoading, setHideLoading] = useState(true)
    const [userData,setUserData] = useState([])
    const [refresh, setRefresh] = useState(false);

    
    const history = useHistory()

    useEffect(() => {
        // validate if the user is currently in here
        if (!localStorage['user']) {
            history.push('/')
            return;
        }
        let USER_DATA = JSON.parse(localStorage['user']);
        setUserData(USER_DATA);
        setHideLoading(false)
        setTimeout(() => {
            // call api to get all of the posts of that user
            Axios(`${Config.SERVER_URL}/home/profile?userid=${USER_DATA._id}`, {
                method: 'get',
                headers: {
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
            })
                .then(response => {
                    setUsersPost(response.data.data.reverse())
                    setHideLoading(true)
                })
                .catch(err => console.error(err));
        }, 500)

    }, [refresh])

    // JSX that represents content of when user has no tweets yet
    const noTweetYetContent = (
        <>
            <div className="loading-tweet-span-container">
                <span className="loading-tweet-span" hidden={hideLoading}>
                    <CircularProgress color="inherit" size={40} thickness={6} />
                </span>
            </div>
            <div className="no-tweet-yet-container">
                <h5>You haven't tweeted yet</h5>
                <p>When you post a tweet, it'll show up here.</p>
            </div>
        </>
    )

    return (
        <>
            {
                userPost.length === 0
                    ? (
                        noTweetYetContent
                    )
                    : userPost.map((post, index) => {
                        return (
                            <PostComponent setRefresh={setRefresh} refresh={refresh} key={index} tweet={post.tweet} post={post} profile={true} />
                        )
                    })
            }
        </>
    )
}