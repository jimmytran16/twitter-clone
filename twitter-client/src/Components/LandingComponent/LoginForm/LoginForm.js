import React from 'react'
import './style.css'
import { Form, Button } from 'react-bootstrap'


function LoginForm() {
    return (
        <Form style={formStyle} inline>
            <Form.Control
                className="mb-2 mr-sm-2"
                id="inlineFormInputName2"
                placeholder="Phone, or username"
                style={inputStyle}
            />
            <Form.Control 
                className="mb-2 mr-sm-2"
                id="inlineFormInputName2"
                placeholder="Password"
                style={inputStyle}
            />
            <Button type="submit" className="mb-2 login-btn">
                Log in
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

const formStyle = {
    padding:'10px',
    display: 'flex',
    justifyContent:'space-evenly'
}

export default LoginForm;