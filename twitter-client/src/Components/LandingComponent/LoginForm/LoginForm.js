import React, { useState, useRef } from 'react'
import './style.css'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'

const LOGGING_IN_VALUE = 'Logging in...'
const LOG_IN_BUTTON_DEFAULT_VALUE = 'Log in'

function LoginForm() {
    const [phone,setPhone] = useState("");
    const [password,setPassword] = useState("");
    const [loginButtonVal, setLoginButtonVal] = useState("Log in");
    
    const handleLoginSubmission = () => {
        setLoginButtonVal(LOGGING_IN_VALUE)
        setTimeout(() => {
            axios.post('http://localhost:3001/user/signin', {
            phone:phone,
            password:password
            })
            .then (response => {
                console.log(response.data)
                setLoginButtonVal(LOG_IN_BUTTON_DEFAULT_VALUE)
            })
            .catch(err => console.error(err))
        }, 2000)
    }

    return (
        <Form className="login-form" inline>
            <Form.Control
                className="mb-2 mr-sm-2"
                id="inlineFormInputName2"
                placeholder="Phone, or username"
                style={inputStyle}
                onChange = {(e) => setPhone(e.target.value)}
            />
            <Form.Control 
                className="mb-2 mr-sm-2"
                id="inlineFormInputName2"
                placeholder="Password"
                style={inputStyle}
                onChange ={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLoginSubmission}  type="button" className="mb-2 login-btn">
                {loginButtonVal}
            </Button>
        </Form>
    )
}

const inputStyle = {
    height:'60px',
    borderBottom:'3px lightgrey solid',
    borderRadius:'unset',
    backgroundColor:'transparent',
    color:'white'
}


export default LoginForm;