import React, { useEffect, useState } from 'react'
import './style.css'
import ThreadTweetComponent from './ThreadTweetComponent/ThreadTweetComponent'
import CommentComponent from './CommentComponent/CommentComponent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Container } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import Configs from '../../Configs'
import axios from 'axios'

export default function ThreadComponent(props) {
    const history = useHistory()

    return (
        <>
            <Container>
                {/* <h1>{props.match.params.id}</h1> */}
                <div className="go-back-to-tweet-container">
                    <FontAwesomeIcon onClick={() => history.push('/dashboard')} className="go-back-to-tweet-icon" color="rgb(8, 160, 233)" icon={faArrowLeft} />
                    <p className="tweet-text-p">Tweet</p>
                </div>
                <ThreadTweetComponent post={props.match.params.id} />
            </Container>
        </>
    )
}