import React, { useState, useRef } from 'react'
import './style.css'
import { Form, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import Configs from '../../../Configs'

const LOGGING_IN_VALUE = 'Logging in...'
const LOG_IN_BUTTON_DEFAULT_VALUE = 'Log in'

/**
 * Componenet function that represents the login form
*/
function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginButtonVal, setLoginButtonVal] = useState("Log in");
    const [loginMessage, setLoginMessage] = useState(null);

    const history = useHistory()


    const handleLoginSubmission = (e) => {
        e.preventDefault();
        setLoginButtonVal(LOGGING_IN_VALUE)
        setTimeout(() => {
            axios({
                method: 'POST',
                data: {
                    username: username,
                    password: password
                },
                withCredentials: true,
                url: `${Configs.SERVER_URL}/auth/signin`
            })
                .then(response => {
                    console.log(response.data)
                    setLoginButtonVal(LOG_IN_BUTTON_DEFAULT_VALUE)
                    // go to the user's dashboard
                    if (response.data.success) {
                        localStorage.setItem('user', JSON.stringify(response.data.message));
                        console.log('inside local', JSON.parse(localStorage['user']))
                        history.push('/dashboard');

                    } else {
                        setLoginMessage(response.data.message)
                    }
                })
                .catch(err => console.error(err))
        }, 2000)
    }

    return (
        <Form onSubmit={handleLoginSubmission} className="login-form" inline>
            <Form.Control
                className="mb-2 mr-sm-2"
                id="inlineFormInputName2"
                placeholder="username"
                style={inputStyle}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Form.Control
                className="mb-2 mr-sm-2"
                id="inlineFormInputName2"
                type="password"
                placeholder="Password"
                style={inputStyle}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="mb-2 login-btn">
                {loginButtonVal}
            </Button>
            {
                loginMessage
                    ? (<span style={loginMsgStyle}>{loginMessage}</span>)
                    : (<></>)
            }
        </Form>
    )
}

// Styles
const inputStyle = {
    height: '60px',
    borderBottom: '3px lightgrey solid',
    borderRadius: 'unset',
    backgroundColor: 'transparent',
    color: 'white'
}

const loginMsgStyle = {
    color: 'white'
}


export default LoginForm;