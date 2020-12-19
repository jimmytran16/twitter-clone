import React, { useEffect, useState } from 'react'
import './style.css'
import PostComponent from '../DashboardComponent/PostComponent/PostComponent'
import { Container, Nav, Card, Button, Row, Col } from 'react-bootstrap'
import CircularProgress from '@material-ui/core/CircularProgress';
import avatarImg from '../../avatar.png'
import Axios from 'axios'
import { useHistory } from 'react-router-dom'
import Config from '../../Configs'

// Styles
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

/**
 * Componenet function that represents the user's profile page
 */
function ProfileComponent() {
    const [tweetsBtnStyling, setTweetsBtnStyling] = useState(navLinkDefaultStyling)
    const [repliesBtnStyling, setRepliesBtnStyling] = useState(navLinkDefaultStyling)
    const [mediaBtnStyling, setMediaBtnStyling] = useState(navLinkDefaultStyling)
    const [likesBtnStyling, setLikesBtnStyling] = useState(navLinkDefaultStyling)
    const [userData, setUserData] = useState({})
    const [userPost, setUsersPost] = useState([])
    const [hideLoading, setHideLoading] = useState(true)

    const history = useHistory()

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
        setHideLoading(false)
        setTimeout(() =>{
            // call api to get all of the posts of that user
            Axios(`${Config.SERVER_URL}/home/profile?userid=${USER_DATA._id}`,{
                method:'get',
                headers: {
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
            })
            .then(response =>{
                setUsersPost(response.data.data.reverse())
                setHideLoading(true)
            })
            .catch(err => console.error(err));
        },500)

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
        <Container className="user-profile-container">
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
                                        <p><strong>0</strong> Following</p>
                                        <p><strong>0</strong> Follwers</p>
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
                            <PostComponent key={index} tweet={post.tweet} post={post} profile={true} />
                        )
                    })
            }
        </Container>
    )
}


export default ProfileComponent;