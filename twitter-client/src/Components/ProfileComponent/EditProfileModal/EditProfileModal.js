import React, { useState, useEffect } from 'react'
import './style.css'
import { Modal, Button, Form } from 'react-bootstrap'
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircularProgress from '@material-ui/core/CircularProgress'
import { saveNewProfilePicture } from '../../../Helpers/helpers'
import Config from '../../../Configs'
import axios from 'axios'

export default function EditProfileModal(props) {
    const [show, setShow] = useState(props.show);
    const [hideLoading, setHideLoading] = useState(true);
    const [message, setMessage] = useState(null)
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        setShow(props.show)
    }, [props.show])

    const handleUpload = () => {
        if (selected !== null) {
            setHideLoading(false)
            const data = new FormData()
            data.set('file', selected, `${Date.now()}-${selected.name}`);
            data.append('userId', JSON.parse(localStorage.getItem('user'))._id);
            setTimeout(() => {
                axios({
                    url: `${Config.SERVER_URL}/home/upload`,
                    method: 'post',
                    data: data,
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                    .then(response => {
                        console.log(response.data)
                        // save new profile picture to the local storage
                        saveNewProfilePicture(response.data.message.savedData.fileName)
                        setMessage('Sucessfully uploaded picture!')
                        setHideLoading(true)
                        setShow(false)
                    })
                    .catch(err => {
                        console.error(err)
                        setHideLoading(true)
                        setMessage('Error uploading!')
                    });
            }, 500)
        }
    }

    return (
        <Modal className="modal-main-container" show={show} onHide={() => setShow(false)}>
            <div className="twitter-icon-container">
                <FontAwesomeIcon className="twitter-icon" icon={faTwitterSquare} size="2x" />
            </div>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Form>
                    <label htmlFor="file">Choose profile picture:</label>
                    <input id="file" type="file" name="file" onChange={(e) => setSelected(e.target.files[0])} />
                    <div className="login-modal-button-container">
                        <Button onClick={handleUpload} className="next-btn" variant="primary" >
                            <span style={{ margin: '0px 5px' }}>Save</span>
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
