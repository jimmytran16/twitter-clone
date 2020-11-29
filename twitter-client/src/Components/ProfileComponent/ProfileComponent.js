import React ,{ useEffect, useState } from 'react'
import './style.css'
import PostComponent from '../DashboardComponent/PostComponent/PostComponent'
import { Container, Nav, Card, Button, Row, Col } from 'react-bootstrap'
import avatarImg from '../../avatar.png'
import { faBreadSlice } from '@fortawesome/free-solid-svg-icons'


const cardBodyStyleHeader = {
    height: "10vh"
}

const navStyling = {
    marginTop:'20px',
}

const navLinkDefaultStyling = {
    border:'unset'
}

const navLinkOnClickStyling = {
    border:'unset!important',
    borderStyle: 'solid',
    borderRight:'unset',
    borderLeft:'unset',
    borderTop:'unset',
    borderColor:'#08a0e9!important'
}

function ProfileComponent() {
    const [tweetsBtnStyling, setTweetsBtnStyling] = useState(navLinkDefaultStyling)
    const [repliesBtnStyling, setRepliesBtnStyling] = useState(navLinkDefaultStyling)
    const [mediaBtnStyling, setMediaBtnStyling] = useState(navLinkDefaultStyling)
    const [likesBtnStyling, setLikesBtnStyling] = useState(navLinkDefaultStyling)

    useEffect(() => {
        console.log('set styling!!!!')
        setTweetsBtnStyling(navLinkDefaultStyling);
    }, [])

    function handleLinkClicks(event) {
        let navClicked =  event.target.innerText
        console.log(navClicked)
        switch(navClicked) {
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
                                    <p className="user-username">@jjimmytran</p>
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
            <PostComponent />
        </Container>
    )
}

export default ProfileComponent;