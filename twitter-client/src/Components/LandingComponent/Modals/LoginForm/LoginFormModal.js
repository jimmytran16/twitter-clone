import React, { useEffect, useState } from 'react'
import './style.css'
import { Modal, Form, Button, Col } from 'react-bootstrap'
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Configs from '../../../../Configs'
import { saveUserDataToLocal } from '../../../../Helpers/helpers'
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom'

/**
 * Componenet function that represents the Register form 
 * @param {Object} props - data that are sent to the component.
 * @param {String} props.show - a boolean that enables/disables the modal to show 
*/

function LoginFormModal(props) {
    const [show, setShow] = useState(props.show);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [hideLoading, setHideLoading] = useState(true);
    const [message, setMessage] = useState(null)

    const history = useHistory()

    useEffect(() => {
        setShow(props.show);
    }, [props.show])

    const handleLogin = (e) => {
        e.preventDefault()
        if (!username || !password) {
            setMessage("Please fill out everything on the form!")
        }
        else {
            setHideLoading(false)
            setTimeout(() => {
                axios({
                    method: "post",
                    data: {
                        username: username,
                        password: password
                    },
                    url: `${Configs.SERVER_URL}/auth/signin`,
                })
                    .then(response => {
                        console.log(response.data)
                        setHideLoading(true)
                        // go to the user's dashboard
                        if (response.data.success) {
                            saveUserDataToLocal(response.data.data)
                            console.log('inside local', JSON.parse(localStorage['user']))
                            history.push('/dashboard');

                        } else {
                            setMessage(response.data.message)
                        }
                    })
                    .catch(err => console.error(err))
            }, 2000)
        }
    }

    return (
        <Modal className="modal-main-container" show={show} onHide={() => setShow(false)}>
            <div className="twitter-icon-container">
                <FontAwesomeIcon className="twitter-icon" icon={faTwitterSquare} size="2x" />
            </div>
            <Modal.Header closeButton>
                <Modal.Title>Log in</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Form>
                    <Form.Group controlId="formGroupPassword">
                        <Form.Control style={inputStyle} type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formGroupPassword">
                        <Form.Control style={inputStyle} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <div className="login-modal-button-container">
                        <Button type="submit" className="next-btn" variant="primary" onClick={handleLogin}>
                            <span style={{ margin: '0px 5px' }}>Log in</span>
                            <span style={{ margin: '0px 5px' }} hidden={hideLoading} className="login-loading-span">
                                <CircularProgress color="blue" size={15} thickness={6} />
                            </span>
                        </Button>
                        <br />
                        {
                            (message)
                                ? <span> {message} </span>
                                : <span></span>
                        }
                    </div>
                </Form>
            </Modal.Body>
        </Modal>

    )
}

// Styles
const inputStyle = {
    height: '60px',
    borderBottom: '3px lightgrey solid',
    borderRadius: 'unset',
}


export default LoginFormModal;