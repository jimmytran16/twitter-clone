import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import './style.css'
import { Form, Container, Card, Button } from 'react-bootstrap'
import PostComponent from './PostComponent/PostComponent'
import axios from 'axios'



function DashboardComponent() {
    const [tweet,setTweet] = useState("");
    const [posts,setPosts] = useState([]);
    const [refresh,setRefresh] = useState(false);
    const [userData,setUserData] = useState({})

    const history = useHistory()

    axios.defaults.withCredentials = true;

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
            url: 'https://twitter-cl0ne-api.herokuapp.com/home'
        })
        .then(response => {
            if (response.data.success) {
                console.log(response.data.data)
                setPosts(response.data.data.reverse())
            }
        })
        .catch(err => console.error(err));


    },[refresh])

    const handleTweetSubmission = () => {
        axios.post('https://twitter-cl0ne-api.herokuapp.com/home/tweet/post',{
            userid:userData._id,
            username: userData.phone,
            name: userData.name,
            tweet: tweet,
        })
        .then(response => {
            console.log(response.data)
            setRefresh(!refresh)
        })
        .catch(err => console.error(err))
    }

    const handleLogout = () => {
        axios({
            method: 'POST',
            withCredentials: true,
            url: 'https://twitter-cl0ne-api.herokuapp.com/user/logout'
        })
        .then(response => {
            console.log(response.data);
            delete localStorage['user'];
            history.push('/')
        })
        .catch(err => console.error(err));
    }

    return (
        <>
            <Container>
                <div className="welcome-user-container"> 
                    <p>Welcome, { userData.name }</p> <Button onClick={handleLogout}>Logout</Button>
                </div>
                <Card style={{ marginBottom: '10px', borderRadius: 'unset' }}>
                    <Card.Body>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Control onChange={(e) => setTweet(e.target.value)} style={{border:'unset'}} as="textarea" rows={3} placeholder="What's happening?" />
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
                            <>
                        <h2>{post.username}</h2>
                            <PostComponent username={post.username} tweet={post.tweet} name={post.name} date={post.date.split('T')[0]} key={key} /></>
                        )
                    })
                }
            </Container>
        </>
    )
}

export default DashboardComponent;