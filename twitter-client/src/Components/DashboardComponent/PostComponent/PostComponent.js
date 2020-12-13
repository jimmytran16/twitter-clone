import React from 'react'
import './style.css'
import { faComment, faRecycle, faHeart, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import avatarImage from '../../../avatar.png'
import { Card, Row, Col } from 'react-bootstrap'
import moment from 'moment'
import axios from 'axios'
import Config from '../../../Configs'
import clearLocalStorageData from '../../../Helpers/helpers'

// set axios requests to include cookie 
// axios.defaults.withCredentials = true;

/**
    * Componenet function that represents each user's individual posts
    * @param {Object} props - data that are sent to the component.
    * @param {String} props.post.id - id associated with this post
    * @param {String} props.post.name - name of the author of the post
    * @param {String} props.post.username - username of author of the post (NOT DONE)
    * @param {String} props.post.date - date of the post
    * @param {String} props.post.tweet - tweet data for the post
 */

function PostComponent(props) {

    // func to handle the interactions (COMMENT,RETWEET,LIKES,LINK OFFS)
    const handleInteraction = (e) => {
        e.preventDefault()

        // if this is retweeting from the profile page, then don't do anything
        if (props.profile) {
            return;
        }
        // call the endpoint to update the post's interaction
        axios({
            method: 'post',
            url: `${Config.SERVER_URL}/home/interaction`,
            headers: {
                authorization: `bearer ${localStorage.getItem('accessToken')}`
            },
            data: {
                id: props.post._id, action: e.currentTarget.id
            },
        })
        .then(response => {
            console.log(response.data)
            
            if (!response.data.success && response.data.msg === 'Unauthorized!') clearLocalStorageData()
            props.setRefresh(!props.refresh)
        })
        .catch(err => console.error(err));

    }

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
                            <div className="user-name-container"> <p>{props.post.name}</p> <span>@{props.post.username} • {moment(props.post.date.split('T')[0]).fromNow()} </span> </div>
                            <p>
                                {props.post.tweet}
                            </p>
                            <footer className="blockquote-footer">
                                <div className="post-icons-container">
                                    <div id='COMMENT' >
                                        <FontAwesomeIcon onClick={handleInteraction} className="fComment" icon={faComment} id='COMMENT' /> <span className="comment-span">0</span>
                                    </div>
                                    <div id='RETWEET'>
                                        <FontAwesomeIcon onClick={handleInteraction} className="fRecycle" icon={faRecycle} id="RETWEETS" /> <span className="retweet-span">{props.post.retweets}</span>
                                    </div>
                                    <div id='LIKE'>
                                        <FontAwesomeIcon onClick={handleInteraction} className="fHeart" icon={faHeart} id="LIKES" /><span className="like-span">{props.post.likes}</span>
                                    </div>
                                    <div id='LINKOFF'>
                                        <FontAwesomeIcon onClick={handleInteraction} className="fExternal" icon={faExternalLinkAlt} id="LINKOFF" /> <span className="linkoff-span" >0</span>
                                    </div>
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