import React, { useEffect, useState } from 'react'
import './style.css'
import { faComment, faRecycle, faHeart, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import avatarImage from '../../../avatar.png'
import { Card } from 'react-bootstrap'
import moment from 'moment'


export default function CommentComponent({ replyTo,comment }) {
    const handleComment = () => {

    }

    const handleInteraction = () => {

    }

    return (
        <Card className="" style={{ borderRadius: 'unset' }}>
            {/* <button onClick={goToThread}>GO TO THREAD</button> */}
            {/* <CommentComponent  show={showCommentForm} /> */}
            <Card.Body>
                <blockquote className="blockquote mb-0">
                    <div className="comment-profile-container">
                        <div>
                            <img style={{ width: '75px', borderRadius: '45px' }} src={avatarImage} alt="user-img" />
                        </div>
                        <div className="comment-content-container">
                            <p className="tweet-reply-name" style={{ margin: 'unset', display:'inline-block' }}>name </p> <span className="tweet-reply-username" style={{ display: 'inline-block' }}>@{comment.username} • {moment(comment.date).fromNow(true)}  </span>
                            <p>Replying to @{replyTo}</p>
                            <p className="tweet-reply">{comment.reply}</p>
                        </div>
                    </div>
                    <footer className="blockquote-footer">
                        <div className="threads-icons-container">
                            <div id='COMMENT'  >
                                <FontAwesomeIcon onClick={handleComment} className="fComment" icon={faComment} id='COMMENT' />
                            </div>
                            <div id='RETWEET'>
                                <FontAwesomeIcon onClick={handleInteraction} className="fRecycle" icon={faRecycle} id="RETWEETS" />
                            </div>
                            <div id='LIKE'>
                                <FontAwesomeIcon onClick={handleInteraction} className="fHeart" icon={faHeart} id="LIKES" />
                            </div>
                            <div id='LINKOFF'>
                                <FontAwesomeIcon onClick={handleInteraction} className="fExternal" icon={faExternalLinkAlt} id="LINKOFF" />
                            </div>
                        </div>
                    </footer>
                </blockquote>
            </Card.Body>
        </Card>
    )
}