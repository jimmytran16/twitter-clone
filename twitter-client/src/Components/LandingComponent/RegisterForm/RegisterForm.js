import React, { useEffect, useState } from 'react'
import './style.css'
import { Modal, Form, Button, Col } from 'react-bootstrap'
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'

// initialize the months, days ,and years for the birthday drop downs
const months = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];

const years = [2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002,
 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990, 1989, 1988, 1987, 1986, 1985, 1984, 1983, 1982, 1981,
 1980, 1979, 1978, 1977, 1976, 1975, 1974, 1973, 1972, 1971, 1970, 1969, 1968, 1967, 1966, 1965, 1964, 1963, 1962, 1961, 1960, 1959,
 1958, 1957, 1956, 1955, 1954, 1953, 1952, 1951, 1950, 1949, 1948, 1947, 1946, 1945, 1944, 1943, 1942, 1941, 1940, 1939, 1938, 1937, 1936,
 1935, 1934, 1933, 1932, 1931, 1930, 1929, 1928, 1927, 1926, 1925, 1924, 1923, 1922, 1921, 1920, 1919, 1918, 1917, 1916, 1915, 1914, 1913, 1912,
 1911, 1910, 1909, 1908, 1907, 1906, 1905]

const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

function RegisterForm(props) {
    const [show, setShow] = useState(props.show);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [month,setMonth] = useState(months[0]);
    const [day,setDay] = useState(days[0]);
    const [year,setYear] = useState(years[0]);
    const [phone,setPhone] = useState("");
     
    useEffect(() => {
        setShow(props.show);
    }, [props.show])

    const handleRegistration  = (e) => {
        console.log('registration handling')
        axios.post('http://localhost:3001/user/signup',{
            name:name,
            password:password,
            birthday:month + '-' + day + '-' + year,
            phone:phone
        })
        .then(response => console.log(response.data))
        .catch(err => console.error(err))
    }

    return (
        <Modal className="modal-main-container" show={show} onHide={() => setShow(false)}>
            <div className="twitter-icon-container">
                <FontAwesomeIcon className="twitter-icon" icon={faTwitterSquare} size="2x" />
            </div>
            <Modal.Header closeButton>
                <Modal.Title>Create your account</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Form>
                    <Form.Group controlId="formGroupEmail">
                        <Form.Control style={inputStyle} type="email" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                        <div className="character-count-div">{name.length}/50</div>
                    </Form.Group>
                    <Form.Group controlId="formGroupPassword">
                        <Form.Control style={inputStyle} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formGroupPhone">
                        <Form.Control style={inputStyle} type="text" placeholder="Phone" onChange={(e) => setPhone(e.target.value)}  />
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridState" onChange={(e) => setMonth(e.target.value)}>
                            <Form.Label>Month</Form.Label>
                            <Form.Control style={inputStyle} as="select" defaultValue="Choose...">
                                {
                                    months.map((month, index) => {
                                        return (
                                            <option key={index}>{month}</option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridState" onChange={(e) => setDay(e.target.value)} >
                            <Form.Label>Day</Form.Label>
                            <Form.Control style={inputStyle} as="select" defaultValue="Choose...">
                                {
                                    days.map((day, index) => {
                                        return (
                                            <option key={index}>{day}</option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridState" onChange={(e) => setYear(e.target.value)}>
                            <Form.Label>Year</Form.Label>
                            <Form.Control style={inputStyle} as="select" defaultValue="Choose...">
                                {
                                    years.map((year, index) => {
                                        return (
                                            <option key={index}>{year}</option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <div className="sign-up-btn-container">
                        <Button className="next-btn" variant="primary" onClick={handleRegistration}>
                            Sign Up
                        </Button>
                    </div>
                </Form>
            </Modal.Body>

        </Modal>

    )
}

const inputStyle = {
    height: '60px',
    borderBottom: '3px lightgrey solid',
    borderRadius: 'unset',
}


export default RegisterForm;