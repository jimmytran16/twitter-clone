import React, { useEffect, useState } from 'react'
import './style.css'
import axios from 'axios'
import Configs from '../../../Configs'
import CircularProgress from '@material-ui/core/CircularProgress'
import PostComponent from '../../DashboardComponent/PostComponent/PostComponent'

export default function LikesComponent() {
    const [hideLoading, setHideLoading] = useState(false)
    const [likedTweets, setLikedTweets] = useState([])
    // retrieve the tweets that the user liked
    useEffect(() => {
        setTimeout(() => {
            axios({
                url: `${Configs.SERVER_URL}/home/get-all-liked-tweets/${JSON.parse(localStorage.getItem('user'))._id}`,
                headers: { authorization: 'Bearer ' + localStorage.getItem('accessToken') },
                method: 'get'
            })
                .then(response => {
                    console.log(response.data.message)
                    setLikedTweets(response.data.message);
                    setHideLoading(true)
                })
                .catch(err => console.error(err));
        }, 500)
    }, [])
    return (
        <>
            <div className="loading-tweet-span-container" hidden={hideLoading}>
                <span className="loading-tweet-span">
                    <CircularProgress color="inherit" size={40} thickness={6} />
                </span>
            </div>
            {
                (likedTweets.length > 0)
                    ? likedTweets.map((tweet, key) => {
                        return (
                            <PostComponent key={key} post={tweet} style={{ color: '#da6666' }} />
                        )
                    })
                    : <div style={{textAlign:'center'}}><p>You haven't liked any posts yet!</p></div>
            }
        </>
    )
}