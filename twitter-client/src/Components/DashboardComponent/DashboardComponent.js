import React, { useEffect, useState } from 'react'
import './style.css'
import { Form, Container, Card, Button } from 'react-bootstrap'
import PostComponent from './PostComponent/PostComponent'
import axios from 'axios'



function DashboardComponent() {
    const [tweet,setTweet] = useState("");
    const [posts,setPosts] = useState([]);
    const [refresh,setRefresh] = useState(false);

    const handleTweetSubmission = () => {
        axios.post('http://localhost:3001/home/tweet/post',{
            username:'jimmytran16',
            tweet: tweet,
            date: new Date().toLocaleString()
        })
        .then(response => setRefresh(!refresh))
        .catch(err => console.error(err))
    }

    useEffect(() => {
        // call the api to get all of the posts
        axios.get('http://localhost:3001/home')
        .then(response => {
            if (response.data.success) {
                console.log(response.data.data)
                setPosts(response.data.data.reverse())
            }
        })
        .catch(err => console.error(err))
    },[refresh])
    return (
        <>
            <Container>
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
                            <PostComponent tweet={post.tweet} date={post.date.split('T')[0]} key={key} />
                        )
                    })
                }
            </Container>
        </>
    )
}

export default DashboardComponent;