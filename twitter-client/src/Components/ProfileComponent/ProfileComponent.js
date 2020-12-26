import React, { useEffect, useState } from 'react'
import './style.css'
import TweetsComponent from './TweetsComponent/TweetsComponent'
import LikesComponent from './LikesComponent/LikesComponent'
import { Container, Nav, Card, Button, Row, Col } from 'react-bootstrap'
import EditProfileModal from './EditProfileModal/EditProfileModal'
import { useHistory, BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

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
    const [profileUrl,setProfileUrl] = useState(localStorage.getItem('profilePicLocation'))
    const [userData, setUserData] = useState({})
    const [showEdit,setShowEdit] = useState(false)


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
        console.log(showEdit)
    }, [showEdit])

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

    return (
        <Router>
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
                                            <img className="user-profile-avatar" src={profileUrl} />
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
                                <Button onClick={() => setShowEdit(!showEdit)} className="edit-profile-btn" variant="primary">Edit profile</Button>
                                <EditProfileModal show={showEdit} />
                            </Col>
                        </Row>
                        <Nav className="navigation-container" style={navStyling} justify variant="tabs" defaultActiveKey="/home">
                            <Nav.Item>
                                <Nav.Link as={Link} to="/profile/tweets" onClick={handleLinkClicks} style={tweetsBtnStyling}>Tweets</Nav.Link>
                            </Nav.Item>
                            {/* <Nav.Item>
                                <Nav.Link onClick={handleLinkClicks} style={repliesBtnStyling} >Replies</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link onClick={handleLinkClicks} style={mediaBtnStyling} >Media</Nav.Link>
                            </Nav.Item> */}
                            <Nav.Item>
                                <Nav.Link as={Link} to="/profile/likes" onClick={handleLinkClicks} style={likesBtnStyling} >Likes</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Body>
                </Card>
                <Switch>
                    <Route path="/profile/likes" component={LikesComponent} />
                    <Route path="/profile" component={TweetsComponent} />
                </Switch>
            </Container>

        </Router>
    )
}


export default ProfileComponent;