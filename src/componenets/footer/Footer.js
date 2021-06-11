import React, {useState} from "react";
import {ImLinkedin2} from 'react-icons/im';
import {Card, Button, Accordion} from 'react-bootstrap';
import {MdContactMail} from "react-icons/md";
import "./footer.css";


const Footer = ()=>{

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    return(
        <div className="container-fluid d-flex footerDiv align-items-center ">
            <span>Tous drois réservés.</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span>&copy; 2021 WECOOK.</span>
            <div className="contacts">
                <Accordion>
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="0" className="accordionBtn">
                                <MdContactMail style={{color:'#fff', fontSize:'22px'}}/>&nbsp;&nbsp;
                                <ImLinkedin2 style={{color:'#fff', fontSize:'22px'}}/>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse className="footerCollaps" eventKey="0">
                            <Card.Body>
                                <div className="social-icons2">
                                    <a className="social-icon2 icon-linked2"
                                        href="https://www.linkedin.com/in/omar-boudraa-75818039/">
                                        <ImLinkedin2 style={{color:'#fff', fontSize:'22px'}}/>
                                    </a>
                                </div> 
                                    
                                <a className="mail" href="mailto:boudraa.omar@gmail.com">
                                    <strong>boudraa.omar@gmail.com</strong>
                                </a>
                            </Card.Body>
                        </Accordion.Collapse>    
                    </Card>
                </Accordion>
            </div>
        </div>       
    )
}

export default Footer;