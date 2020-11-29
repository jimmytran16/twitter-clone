import React from 'react'
import './style.css'
import { faComment, faRecycle, faHeart, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import avatarImage from '../../../avatar.png'
import { Card, Row, Col } from 'react-bootstrap'


function PostComponent() {
    return (
        <Card style={{ borderRadius: 'unset' }}>
            <Card.Body>
                <Row>
                    <Col xs={2} sm={2} md={2}>
                        <div>
                            <img className="user-profile-tweet-image" src={avatarImage} alt="user-img" />
                        </div>
                    </Col>
                    <Col xs={10} sm={10} md={10}>
                        <blockquote className="blockquote mb-0">
                            <div className="user-name-container"> <p>Jimmy Tran</p> <span>@jjimmytrann</span> </div>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere
                                erat a ante.
                        </p>
                            <footer className="blockquote-footer">
                                <div className="post-icons-container">
                                    <FontAwesomeIcon className="fComment" icon={faComment} />
                                    <FontAwesomeIcon className="fRecycle" icon={faRecycle} />
                                    <FontAwesomeIcon className="fHeart" icon={faHeart} />
                                    <FontAwesomeIcon className="fExternal" icon={faExternalLinkAlt} />
                                </div>
                            </footer>
                        </blockquote>
                    </Col>
                </Row>

            </Card.Body>
        </Card>
    )
}

export default PostComponent