import React, { useState, useRef } from 'react'
import './style.css'
import { Form, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

const LOGGING_IN_VALUE = 'Logging in...'
const LOG_IN_BUTTON_DEFAULT_VALUE = 'Log in'

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginButtonVal, setLoginButtonVal] = useState("Log in");
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
                url: 'https://twitter-cl0ne-api.herokuapp.com/auth/signin'
            })
                .then(response => {
                    console.log(response.data)
                    setLoginButtonVal(LOG_IN_BUTTON_DEFAULT_VALUE)
                    // go to the user's dashboard
                    if(response.data.success){
                        localStorage.setItem('user',JSON.stringify(response.data.message));
                        console.log('inside local',JSON.parse(localStorage['user']))
                        history.push('/dashboard');
                        
                    }
                })
                .catch(err => console.error(err))
        }, 2000)
    }

    const getUserData = () => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: 'https://twitter-cl0ne-api.herokuapp.com/user/userdata'
        })
        .then(response => console.log(response.data))
        .catch(err => console.error(err));
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
            {/* <Button onClick={getUserData} type="submit" className="mb-2 login-btn">
                Get Data
            </Button> */}
        </Form>
    )
}

const inputStyle = {
    height: '60px',
    borderBottom: '3px lightgrey solid',
    borderRadius: 'unset',
    backgroundColor: 'transparent',
    color: 'white'
}


export default LoginForm;