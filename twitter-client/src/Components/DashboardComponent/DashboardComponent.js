import React, { useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import './style.css'
import { Form, Container, Card, Button } from 'react-bootstrap'
import PostComponent from './PostComponent/PostComponent'
import axios from 'axios'
import Config from '../../Configs'

/**
 * Componenet function that represents the user's dashboard
*/
function DashboardComponent() {
    const [tweet,setTweet] = useState("");
    const [posts,setPosts] = useState([]);
    const [refresh,setRefresh] = useState(false);
    const [userData,setUserData] = useState({})

    const history = useHistory()

    // set the axios defaults to send the cookies in request 
    // axios.defaults.withCredentials = true;

    useEffect(() => {

        if(!localStorage['user']) {
            history.push('/')
            return
        }

        // set the user data to the state from the localstorage
        setUserData(JSON.parse(localStorage['user']))

        // call the api to get all of the posts
        axios({
            method: 'GET',
            withCredentials: true,
            url: `${Config.SERVER_URL}/home`
        })
        .then(response => {
            if (response.data.success) {
                console.log(response.data.data)
                setPosts(response.data.data.reverse())
            }
        })
        .catch(err => console.error(err));


    },[refresh])

    // func to handle the tweet submit
    const handleTweetSubmission = () => {
        axios.post(`${Config.SERVER_URL}/home/tweet/post`,{
            userid:userData._id,
            username: userData.phone,
            name: userData.name,
            tweet: tweet,
        }, { withCredentials:true })
        .then(response => {
            console.log(response.data)
            clearTweetFields() 
            setRefresh(!refresh)
        })
        .catch(err => console.error(err))
    }

    // func to handle the logout 
    const handleLogout = () => {
        axios({
            method: 'POST',
            withCredentials: true,
            url: `${Config.SERVER_URL}/home/logout`
        })
        .then(response => {
            console.log(response.data);
            delete localStorage['user'];
            history.push('/')
        })
        .catch(err => console.error(err));
    }

    // function to clear the text area field 
    const clearTweetFields = () => {
        document.getElementsByClassName('tweet-text-area')[0].value = ''
    }

    return (
        <>
            <Container>
                <div className="welcome-user-container"> 
                    <p>Welcome, { userData.name }</p> 
                    <Button onClick={handleLogout}>Logout</Button>
                </div>
                <Card style={{ marginBottom: '10px', borderRadius: 'unset' }}>
                    <Card.Body>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Control className="tweet-text-area" onChange={(e) => setTweet(e.target.value)} style={{border:'unset'}} as="textarea" rows={3} placeholder="What's happening?" ></Form.Control>
                            <hr />
                            <div className="tweet-btn-container">
                                <Button onClick={handleTweetSubmission} >Tweet</Button>
                            </div>
                        </Form.Group>
                    </Card.Body>
                </Card>
                {
                    posts.map((post,key) => {
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