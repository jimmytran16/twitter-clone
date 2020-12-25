import React, { useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import './style.css'
import { Form, Container, Card, Button } from 'react-bootstrap'
import PostComponent from './PostComponent/PostComponent'
import axios from 'axios'
import Config from '../../Configs'
import { clearLocalStorageData } from '../../Helpers/helpers'
import CircularProgress from '@material-ui/core/CircularProgress';


/**
 * Componenet function that represents the user's dashboard
*/
function DashboardComponent() {
    const [tweet, setTweet] = useState("");
    const [posts, setPosts] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [userData, setUserData] = useState({})
    const [hideLoading,setHideLoading] = useState(false)
    const [loadTime,setLoadTime] = useState(800)
    const [disableTweetBtn, setDisableTweetBtn] = useState(true)

    const history = useHistory()

    // set the axios defaults to send the cookies in request 
    useEffect(() => {

        if (!localStorage['user']) {
            history.push('/')
            return
        }

        // set the user data to the state from the localstorage
        setUserData(JSON.parse(localStorage['user']))
        
        setTimeout(() => {
            // call the api to get all of the posts
            axios(`${Config.SERVER_URL}/home`, {
                method: 'get',
                headers: {
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
                .then(response => {
                    console.log(response.data.data)
                    setHideLoading(true)
                    setLoadTime(0)
                    if (response.data.success) {
                        setPosts(response.data.data.reverse())
                    }else {
                        clearLocalStorageData()
                    }
                })
                .catch(err => console.error(err));
        },loadTime)

    }, [refresh])

    // func to handle the tweet submit
    const handleTweetSubmission = () => {

        axios({
            method: 'post',
            url: `${Config.SERVER_URL}/home/tweet/post`,
            headers: {
                authorization: `bearer ${localStorage.getItem('accessToken')}`
            },
            data: {
                userid: userData._id,
                username: userData.username,
                name: userData.name,
                tweet: tweet,
            }
        })
            .then(response => {
                console.log(response.data)
                // if they are unauthorized, then we will force a log out
                if (!response.data.success && response.data.msg === 'Unauthorized!') clearLocalStorageData()
                clearTweetFields()
                setRefresh(!refresh)
            })
            .catch(err => console.error(err))
    }

    // function to store the tweet input into state
    const updateTweetInput = (e) => {
        setTweet(e.target.value)
        setDisableTweetBtn( (e.target.value === '') ? true : false)
    }

    // function to clear the text area field 
    const clearTweetFields = () => {
        document.getElementsByClassName('tweet-text-area')[0].value = ''
    }

    return (
        <>
            <Container className="dashboard-container">
                <div className="welcome-user-container">
                    <p>Welcome, {userData.name}</p>
                </div>
                <Card style={{ marginBottom: '10px', borderRadius: 'unset' }}>
                    <Card.Body>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Control className="tweet-text-area" onChange={updateTweetInput} style={{ border: 'unset' }} as="textarea" rows={3} placeholder="What's happening?" ></Form.Control>
                            <hr />
                            <div className="tweet-btn-container">
                                <Button disabled={disableTweetBtn} onClick={handleTweetSubmission} >Tweet</Button>
                            </div>
                        </Form.Group>
                    </Card.Body>
                </Card>
                <div className="loading-tweet-span-container">
                    <span className="loading-tweet-span" hidden={hideLoading}>            
                        <CircularProgress color="inherit" size={40} thickness={6} />
                    </span>
                </div>
                {
                    posts.map((post, key) => {
                        return (
                            <PostComponent refresh={refresh} setRefresh={setRefresh} post={post} key={key} />
                        )
                    })
                }
            </Container>
        </>
    )
}

export default DashboardComponent;