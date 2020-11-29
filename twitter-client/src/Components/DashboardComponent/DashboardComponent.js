import React from 'react'
import './style.css'
import { Form, Container, Card, Button } from 'react-bootstrap'
import PostComponent from './PostComponent/PostComponent'



function DashboardComponent() {
    return (
        <>
            <Container>
                <Card style={{ marginBottom: '10px', borderRadius: 'unset' }}>
                    <Card.Body>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Control style={{border:'unset'}} as="textarea" rows={3} placeholder="What's happening?" />
                            <hr />
                            <div className="tweet-btn-container">
                                <Button >Tweet</Button>
                            </div>
                        </Form.Group>
                    </Card.Body>
                </Card>
                <PostComponent />
            </Container>
        </>
    )
}

export default DashboardComponent;