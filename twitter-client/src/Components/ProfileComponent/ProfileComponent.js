import React, { useEffect, useState } from 'react'
import './style.css'
import PostComponent from '../DashboardComponent/PostComponent/PostComponent'
import { Container, Nav, Card, Button, Row, Col } from 'react-bootstrap'
import avatarImg from '../../avatar.png'
import { faBreadSlice } from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios'
import { useHistory } from 'react-router-dom'


const cardBodyStyleHeader = {
    height: "10vh"
}

const navStyling = {
    marginTop: '20px',
}

const navLinkDefaultStyling = {
    border: 'unset'
}

const navLinkOnClickStyling = {
    border: 'unset!important',
    borderStyle: 'solid',
    borderRight: 'unset',
    borderLeft: 'unset',
    borderTop: 'unset',
    borderColor: '#08a0e9!important'
}

function ProfileComponent() {
    const [tweetsBtnStyling, setTweetsBtnStyling] = useState(navLinkDefaultStyling)
    const [repliesBtnStyling, setRepliesBtnStyling] = useState(navLinkDefaultStyling)
    const [mediaBtnStyling, setMediaBtnStyling] = useState(navLinkDefaultStyling)
    const [likesBtnStyling, setLikesBtnStyling] = useState(navLinkDefaultStyling)
    const [userData, setUserData] = useState({})
    const [userPost, setUsersPost] = useState([])

    const history = useHistory()

    Axios.defaults.withCredentials = true;

    useEffect(() => {
        // validate if the user is currently in here
        if (!localStorage['user']) {
            history.push('/')
            return;
        }
        console.log('set styling!!!!')
        setTweetsBtnStyling(navLinkDefaultStyling);
        let USER_DATA = JSON.parse(localStorage['user']);
        setUserData(USER_DATA);

        // call api to get all of the posts of that user
        Axios.get(`https://twitter-cl0ne-api.herokuapp.com/home/profile?userid=${USER_DATA._id}`)
            .then(response => setUsersPost(response.data.data.reverse()))
            .catch(err => console.error(err));

    }, [])

    // function to handle the clicks of the menus
    function handleLinkClicks(event) {
        let navClicked = event.target.innerText
        console.log(navClicked)
        switch (navClicked) {
            case 'Tweets':
                setTweetsBtnStyling(navLinkOnClickStyling);
                setRepliesBtnStyling(navLinkDefaultStyling);
                setMediaBtnStyling(navLinkDefaultStyling);
                setLikesBtnStyling(navLinkDefaultStyling);
                break;
            case 'Tweets & Replies':
                setTweetsBtnStyling(navLinkDefaultStyling);
                setRepliesBtnStyling(navLinkOnClickStyling);
                setMediaBtnStyling(navLinkDefaultStyling);
                setLikesBtnStyling(navLinkDefaultStyling);
                break;
            case 'Media':
                setTweetsBtnStyling(navLinkDefaultStyling);
                setRepliesBtnStyling(navLinkDefaultStyling);
                setMediaBtnStyling(navLinkOnClickStyling);
                setLikesBtnStyling(navLinkDefaultStyling);
                break;
            case 'Likes':
                setTweetsBtnStyling(navLinkDefaultStyling);
                setRepliesBtnStyling(navLinkDefaultStyling);
                setMediaBtnStyling(navLinkDefaultStyling);
                setLikesBtnStyling(navLinkOnClickStyling);
                break;
            default:
                console.log('No cases matched!')
                break;
        }
    }

    const noTweetYetContent = (<div className="no-tweet-yet-container">
        <h5>You haven't tweeted yet</h5>
        <p>When you post a tweet, it'll show up here.</p>
    </div>)

    return (
        <Container>
            <Card className="text-center">
                <Card.Body style={cardBodyStyleHeader}>
                </Card.Body>
                <Card.Body>
                    <hr />
                    <Row>
                        <Col>
                            <Row>
                                <Col md={12}>
                                    <div>
                                        <img className="user-profile-avatar" src={avatarImg} />
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <p className="user-username">@{userData.username}</p>
                                    <div className="follow-details-container">
                                        <p><strong>440</strong> Following</p>
                                        <p><strong>200</strong> Follwers</p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Button className="edit-profile-btn" variant="primary">Edit profile</Button>
                        </Col>
                    </Row>
                    <Nav className="navigation-container" style={navStyling} justify variant="tabs" defaultActiveKey="/home">
                        <Nav.Item>
                            <Nav.Link onClick={handleLinkClicks} style={tweetsBtnStyling}>Tweets</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={handleLinkClicks} style={repliesBtnStyling} >Tweets & Replies</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={handleLinkClicks} style={mediaBtnStyling} >Media</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={handleLinkClicks} style={likesBtnStyling} >Likes</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Card.Body>
            </Card>
            {
                userPost.length === 0
                    ? (
                        noTweetYetContent
                    )
                    : userPost.map((post, index) => {
                        return (
                            <PostComponent key={index} tweet={post.tweet} date={post.date} name={post.name} username={post.username} />
                        )
                    })
            }
        </Container>
    )
}


export default ProfileComponent;