import React, { useEffect, useState } from 'react'
import { Modal, Form, Button, Col, Row } from 'react-bootstrap'
import './style.css'
import avatarImage from '../../../avatar.png'
import verticalImage from '../../../vertical.png'
import moment from 'moment'
import axios from 'axios'
import Configs from '../../../Configs'
import CircularProgress from '@material-ui/core/CircularProgress';


import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function CommentComponent(props) {
    const [show, setShow] = useState(props.show)
    const [reply, setReply] = useState("")
    const [disableReplyBtn, setDisableReplyBtn] = useState(true)
    const [hideCircularProgress,setHideCircularProgress] = useState(true)

    useEffect(() => {
        setShow(props.show);
    }, [props.show])

    // update the reply
    const updateReplyHandler = (e) => {
        console.log(e.target.value);
        // get the reply value and update it
        let REPLY_VALUE = e.target.value;
        setReply(REPLY_VALUE);
        // check if the reply has a value, if not then disable the button
        setDisableReplyBtn((e.target.value.length === 0) ? true : false);
    }

    // function to send the reploy to the server to update the post's comments
    const handleCommentSubmission = (e) => {
        // set the circular progress 
        setHideCircularProgress(false)

        // call the interaction endpoint to pass in the comment
        setTimeout(() =>{
            axios({
                method:'post',
                url:`${Configs.SERVER_URL}/home/interaction`,
                headers: {
                    authorization: `bearer ${localStorage.getItem('accessToken')}`
                },
                data: {
                    action:'COMMENT',
                    id:props.post._id,
                    reply:reply,
                    userId: JSON.parse(localStorage.getItem('user'))._id,
                    username: JSON.parse(localStorage.getItem('user')).username,
                    replyTo: props.post.username
                }
            })
            .then(response => {
                //clear reply field
                setReply("")
                setHideCircularProgress(true)
                // get rid off the comment window
                setShow(false)
                console.log(response.data)
            })
            .catch(err => console.error(err));
        }, 1000)

    }

    return (
        <Modal className="modal-main-container" show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Form>
                    <div className="comment-info-container">
                        <div style={{ display: 'flex' }}>
                            <div>
                                <img style={{display:'block'}} className="commenter-profile-pic" src={avatarImage} height="40px" width="40px" />
                                <img  src={verticalImage} height="40px" width="40px" />
                            </div>
                            <div style={{margin:'0px 12px'}}>
                                <div className="user-name-container" style={{ display: "flex", fontSize:'12px' }}> <p style={{ margin:'unset', paddingRight:'5px', fontWeight:'bolder'}}>{props.post.name}</p> <span>@{props.post.username} • {moment(props.post.date.split('T')[0]).fromNow()} </span> </div>
                                <p style={{wordBreak:'break-word'}}>{props.post.tweet}</p>
                            </div>
                        </div>
                    </div>

                    <div className="comment-reply-container">
                        <img className="commenter-profile-pic" src={avatarImage} height="40px" width="40px" />
                        <Form.Control value={reply} className="comment-text-area" onChange={updateReplyHandler} style={{ border: 'unset' }} as="textarea" rows={3} placeholder="Tweet your reply" ></Form.Control>
                    </div>
                    <div className="reply-button-container">
                        <Button id="COMMENT" onClick={handleCommentSubmission} disabled={disableReplyBtn} >
                            Reply 
                            <span style={{margin:'0px 3px'}} hidden={hideCircularProgress} className="loader-reply-comment">
                                <CircularProgress color="primary" size={15} thickness={6} />    
                            </span> 
                        </Button>
                    </div>
                </Form>
            </Modal.Body>

        </Modal>
    )
}