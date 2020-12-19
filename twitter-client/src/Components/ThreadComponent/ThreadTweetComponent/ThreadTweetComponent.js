import React, { useEffect, useState } from 'react'
import './style.css'
import { faComment, faRecycle, faHeart, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CommentComponent from '../CommentComponent/CommentComponent'
import avatarImage from '../../../avatar.png'
import { Card } from 'react-bootstrap'
import moment from 'moment'
import Configs from '../../../Configs'
import axios from 'axios'


export default function ThreadTweetComponent(props) {
    {
        const [showCommentForm, setShowCommentForm] = useState(false)
        const [postDetail, setPostDetail] = useState({})
        const [threadComments, setThreadComments] = useState([])

        useEffect(() => {
            axios({
                url: `${Configs.SERVER_URL}/home/thread/${props.post}`,
                method: 'get',
            })
                .then(response => {
                    if (response.data.success) {
                        setPostDetail(response.data.message.post)
                        setThreadComments(response.data.message.comments.comments)
                        console.log(response.data.message.comments)
                    }
                })
                .catch(err => console.error(err))
        }, [])
        const handleComment = () => {

        }

        const handleInteraction = () => {

        }

        return (
            <>
                <Card className="" style={{ borderRadius: 'unset' }}>
                    {/* <button onClick={goToThread}>GO TO THREAD</button> */}
                    {/* <CommentComponent  show={showCommentForm} /> */}
                    <Card.Body>
                        <blockquote className="blockquote mb-0">
                            <div className="thread-profile-container">
                                <div style={{ display: 'inline-block' }}>
                                    <img style={{ width: '75px', borderRadius: '45px' }} src={avatarImage} alt="user-img" />
                                </div>
                                <div style={{ display: 'inline-block', margin: '5px 5px' }} className="user-name-container">
                                    <p style={{ display: 'block', margin: 'unset' }}>{postDetail.name} </p> <span style={{ display: 'block' }}>@{postDetail.username}</span>
                                </div>
                            </div>
                            <div className="thread-tweet-and-date-container">
                            <p className="thread-tweet">
                                {postDetail.tweet}
                            </p>
                                <p>
                                    {moment(postDetail.date).format('LLL')}
                                </p>
                            </div>
                            <hr />
                            <div className="thread-interaction-container">
                                { (postDetail.retweets > 0)
                                 ? (<p> {postDetail.retweets} Retweets</p>) 
                                 : (<p></p>)
                                }  

                                { (postDetail.likes > 0)
                                 ? (<p> {postDetail.likes} Likes</p>) 
                                 : (<p></p>)
                                } 
                            </div>
                            <hr />
                            <footer className="blockquote-footer">
                                <div className="threads-icons-container">
                                    <div id='COMMENT' onClick={() => setShowCommentForm(!showCommentForm)} >
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
                {
                    threadComments.map((comment,key) => {
                        return (
                            <CommentComponent replyTo={postDetail.username} comment={comment} key={key} />
                        )
                    })
                }
            </>

        )
    }
}