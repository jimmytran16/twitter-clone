import React, { useState } from 'react'
import './style.css'
import { faComment, faRecycle, faHeart, faExternalLinkAlt, faEllipsisH, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import avatarImage from '../../../avatar.png'
import { Card, Row, Col } from 'react-bootstrap'
import moment from 'moment'
import axios from 'axios'
import Config from '../../../Configs'
import clearLocalStorageData from '../../../Helpers/helpers'
import CommentComponent from '../CommentFormComponent/CommentComponent'
import Dropdown from 'rc-dropdown'
import 'rc-dropdown/assets/index.css';
import Menu, { Item as MenuItem, Divider } from 'rc-menu'
import { useHistory } from "react-router-dom";


// delete modal 
import { Modal, Button } from 'react-bootstrap'


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
    const [showCommentForm, setShowCommentForm] = useState(false)
    const [show, setShow] = useState(false)
    const history = useHistory()

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
                id: props.post._id, action: e.currentTarget.id, userId: JSON.parse(localStorage.getItem('user'))._id
            },
        })
            .then(response => {
                console.log(response.data)

                if (!response.data.success && response.data.msg === 'Unauthorized!') clearLocalStorageData()
                props.setRefresh(!props.refresh)
            })
            .catch(err => console.error(err));

    }

    const handleComment = (e) => {

    }

    const goToThread = () => {
        history.push(`/thread/${props.post._id}`)
        window.location.reload()
    }

    const handleTweetDeletion = (e) => {
        axios({
            url:`${Config.SERVER_URL}/home/delete-tweet`,
            method:'delete',
            headers: { authorization: 'Bearer ' + localStorage.getItem('accessToken') },
            data: {
                id: props.post._id
            }
        })
        .then(response => {
            if(response.data.success) {
                props.setRefresh(!props.refresh)
                console.log(response.data)
                setShow(false)
            }
        })
        .catch(err => console.error(err))
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const menu = (
        <Menu>
            {/* <MenuItem disabled>disabled</MenuItem> */}
            <MenuItem onClick={handleShow} style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }} key="1">
                <FontAwesomeIcon color="rgb(218, 102, 102)" icon={faTrash} />
                <p style={{ color: 'rgb(218, 102, 102)', margin: '0px 2px' }}>Delete</p>
            </MenuItem>
        </Menu>
    );

    const deleteModal = (
        <Modal className="delete-modal"  show={show} onHide={handleClose}>
            <div className="delete-modal-content-container">
                <Modal.Title style={{fontWeight:'bolder'}}>Delete Tweet?</Modal.Title>
                <Modal.Body>This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from Twitter search results. </Modal.Body>
                <div style={{ margin: '10px auto' }}>
                    <Button style={deleteBtnStyles} variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button style={deleteBtnStyles} variant="danger" onClick={handleTweetDeletion}>
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>
    )

    return (
        <Card className="post-component-card-container" style={{ borderRadius: 'unset' }}>
            {(deleteModal)}
            <CommentComponent post={props.post} show={showCommentForm} />
            <Card.Body>
                <Row>
                    <Col xs={2} sm={2} md={2}>
                        <div>
                            <img className="user-profile-tweet-image" src={(props.profile) ? localStorage.getItem('profilePicLocation') : `https://firebasestorage.googleapis.com/v0/b/twitter-clone-a4e87.appspot.com/o/${props.post.profileUrl}?alt=media`} alt="user-img" />
                        </div>
                    </Col>
                    <Col xs={10} sm={10} md={10}>
                        <blockquote className="blockquote mb-0">
                            <div className="user-name-container"> <p>{props.post.name}</p> <span>@{props.post.username} • {moment(props.post.date.split('T')[0]).fromNow()} </span>
                                {
                                    (JSON.parse(localStorage.getItem('user')).username === props.post.username)
                                        ? (<Dropdown
                                            trigger={['click']}
                                            overlay={menu}
                                            animation="slide-up"
                                        >
                                            <FontAwesomeIcon style={{ float: 'right' }} icon={faEllipsisH} />
                                        </Dropdown>) 
                                        :(<span></span>)
                                }
                            </div>
                            <p>
                                {props.post.tweet}
                            </p>
                            <footer className="blockquote-footer">
                                <div className="post-icons-container">
                                    <div id='COMMENT' onClick={() => setShowCommentForm(!showCommentForm)} >
                                        <FontAwesomeIcon onClick={handleComment} className="fComment" icon={faComment} id='COMMENT' /> <span className="comment-span">{props.post.comments}</span>
                                    </div>
                                    <div id='RETWEET'>
                                        <FontAwesomeIcon onClick={handleInteraction} className="fRecycle" icon={faRecycle} id="RETWEETS" /> <span className="retweet-span">{props.post.retweets}</span>
                                    </div>
                                    <div style={props.style} id='LIKE'>
                                        <FontAwesomeIcon onClick={handleInteraction} className="fHeart" icon={faHeart} id="LIKES" /><span className="like-span">{props.post.likes}</span>
                                    </div>
                                    <div id='LINKOFF'>
                                        <FontAwesomeIcon onClick={goToThread} className="fExternal" icon={faExternalLinkAlt} id="LINKOFF" /> <span className="linkoff-span" ></span>
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

const deleteBtnStyles = {
    borderRadius: '45px',
    width:'40%',
    margin:'0px 2px',
    fontWeight:'bolder'
}

export default PostComponent