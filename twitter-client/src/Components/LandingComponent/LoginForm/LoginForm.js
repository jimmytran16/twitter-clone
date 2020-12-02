import React, { useState, useRef } from 'react'
import './style.css'
import { Form, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

const LOGGING_IN_VALUE = 'Logging in...'
const LOG_IN_BUTTON_DEFAULT_VALUE = 'Log in'

function LoginForm() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loginButtonVal, setLoginButtonVal] = useState("Log in");
    const history = useHistory()


    const handleLoginSubmission = () => {
        setLoginButtonVal(LOGGING_IN_VALUE)
        setTimeout(() => {
            axios({
                method: 'POST',
                data: {
                    username: phone,
                    password: password
                },
                withCredentials: true,
                url: 'http://localhost:3001/auth/signin'
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

    const handleLogout = () => {
        axios({
            method: 'POST',
            withCredentials: true,
            url: 'http://localhost:3001/user/logout'
        })
        .then(response => console.log(response.data))
        .catch(err => console.error(err));
    }

    const getUserData = () => {
        axios({
            method: 'GET',
            withCredentials: true,
            url: 'http://localhost:3001/user/userdata'
        })
        .then(response => console.log(response.data))
        .catch(err => console.error(err));
    }
    return (
        <Form className="login-form" inline>
            <Form.Control
                className="mb-2 mr-sm-2"
                id="inlineFormInputName2"
                placeholder="Phone, or username"
                style={inputStyle}
                onChange={(e) => setPhone(e.target.value)}
            />
            <Form.Control
                className="mb-2 mr-sm-2"
                id="inlineFormInputName2"
                placeholder="Password"
                style={inputStyle}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLoginSubmission} type="button" className="mb-2 login-btn">
                {loginButtonVal}
            </Button>
            <Button onClick={handleLogout} type="button" className="mb-2 login-btn">
                Logout
            </Button>
            <Button onClick={getUserData} type="button" className="mb-2 login-btn">
                Get Data
            </Button>
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