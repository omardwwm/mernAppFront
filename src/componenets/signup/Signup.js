import React, {useState, useEffect} from "react";
// import axios from "axios";
import { useDispatch, useSelector} from "react-redux";
import {registerUser, showConditionsPolicy} from "../../redux";
import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {useHistory} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
// import Conditions from '../conditions/Conditions';
// import imgRegister from '../../images/signup-reg.jpg';
// import badReqImg from '../../images/400-bad-request-.jpg';
// import './Signup.css';




const Signup =(props)=>{
    const dispatch = useDispatch();
    const history = useHistory();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password:"",
        passwordConfirm: "",
        role: [],
        isPro: false,
        errors:{
            usernameError: "",
            emailError: "",
            passwordError: "",
            passwordConfirmError: ""
        }
    })
    const showModale = useSelector(state => state.userReducer.showModale)
    // console.log(showModale);
    const modalImage = useSelector(state => state.userReducer.modalImage)
    const [modal, setModal] = useState(showModale);
    const toggle = () => setModal(!showModale);
    // const [modalBody, setModalBody] = useState("");
    const modalBody = useSelector(state=>state.userReducer.modalBody)
    // const [ModalTitle, setModalTitle] = useState("");
    const modalTitle = useSelector(state=> state.userReducer.modalTitle);
    const modalButtonDisabled = useSelector(state=>state.userReducer.modalButtonDisabled);
    const isUserLogged = useSelector(state=>state.userReducer.isUserLogged);
    const [loginMessage, setLoginMessage] = useState('');
    // const [modalButtonDisabled, setModalButtonDisabled] = useState(false)
    const [test, setTest]= useState(false);
    // const [myImage, setMyImage] = useState(modalImage)

    const validEmailRegex = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
    
    const [profilePicture, setProfilePicture] = useState("");


    const onChangeValue=(event)=>{
        event.preventDefault();
        // TODO: add checkbox to form
        const isCheckBox = event.target.type === "checkbox";
        // console.log(event.target.name);
        const { name, value, checked} = event.target; 
        let errors = form.errors;
        switch (name) {
            case 'username': 
              errors.usernameError = 
                value.length < 5
                  ? 'Username must be 5 characters long!'
                  : '';
              break;
            case 'email': 
              errors.emailError = 
                validEmailRegex.test(value)
                  ? ''
                  : 'Email is not valid!';
              break;
            case 'password': 
              errors.passwordError = 
                value.length < 6
                  ? 'Password must be 6 characters long!'
                  : '';
              break;
            case 'passwordConfirm':
                errors.passwordConfirmError =
                form.password !== value ? 
                'Password must be the same' :
                '';
                break;
            default:
              break;
          }
        setForm({
            ...form,
            errors, [name]:value
        })
            // (
            //     setForm({
            //         ...form,
            //         isPro: ! form.isPro
            //     })
            //   ):               
            //       setForm({
            //           ...form,
            //           errors, [name]: value
            //       })
              

        console.log("myfinalformis", form);
    };

    const onCheckCheckBox =()=>{
        setForm({
            ...form,
            isPro:!form.isPro
        })
        console.log("myfinalformis", form);
    }

    const selectImage = (event)=>{
        event.preventDefault();
        setProfilePicture(event.target.files[0]);
       
    }

    const [conditionsAccepted, setConditionsAccepted] = useState(false)

    const accepteCoditions =()=>{
        setConditionsAccepted(!conditionsAccepted)    
    }
    
    const showConditions = ()=>{
        dispatch(showConditionsPolicy());
        setModal(showModale);
        // setModal(true)
        // setModalTitle('Our policy confidential')
        // setModalButtonDisabled(true)
        // setModalBody(<Conditions onClick={()=>setModalButtonDisabled(!setModalButtonDisabled)} />)  
    }

    const userCreate = (event)=>{
        event.preventDefault();
        const config = {headers: {
            Accept:'*/*',
            'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
        }};
        const formData = new FormData();
        formData.append('username',form.username);
        formData.append('email',form.email);
        formData.append('password',form.password);
        formData.append('passwordConfirm',form.passwordConfirm);
        formData.append('profilePicture',profilePicture);
        // formData.append('role',form.role);
        formData.append('isPro', form.isPro);
        console.log(formData);
        dispatch(registerUser(formData, config));
        // console.log(profilePicture);
        setModal(showModale);
        localStorage.getItem("userToken");
        setTimeout(() => {
            history.push("/recipes")
        }, 3000)
        // if(isUserLogged === true){
        //     setTimeout(() => {
        //         history.push("/recipes")
        //     }, 3000);}
        // setMyImage(modalImage)
        // const isValid = validation();
        // console.log("user create test function");
    }
    
    useEffect(()=>{
        setModal(showModale);
        setForm({
            ...form
        })
    }, [showModale])

    return(
        <div>
            <div className="row">
                {/* <div className="col-4">
                    <h2>test</h2>
                </div> */}
                <div className="col-6 m-3">
                    <h1>CREATE YOUR ACOUNT HERE</h1>
                    <Form onSubmit={userCreate} encType="multipart/form-data">
                        <FormGroup>
                            <Label for="exampleUsername">Username</Label>
                            <Input type="text" name="username" id="exampleUsername" placeholder="Choose Username" value={form.username} onChange={onChangeValue}/>
                        </FormGroup>
                        {form.errors.usernameError ? 
                            <div style={{color:'red'}}>
                                {form.errors.usernameError}
                            </div>:
                             null}
                        <FormGroup>
                            <Label for="exampleEmail">Email</Label>
                            <Input type="email" name="email" id="exampleEmail" placeholder="Your email" value={form.email} onChange={onChangeValue}/>
                        </FormGroup>
                        {form.errors.emailError ? 
                            <div style={{color:'red'}}>
                                {form.errors.emailError}
                            </div>:
                             null}
                        <FormGroup>
                            <Label for="examplePassword">Password</Label>
                            <Input type="password" name="password" id="examplePassword" placeholder="Your password" value={form.password} onChange={onChangeValue} />
                        </FormGroup>
                        {form.errors.passwordError ? 
                            <div style={{color:'red'}}>
                                {form.errors.passwordError}
                            </div>:
                             null}
                        <FormGroup>
                            <Label for="examplePasswordConfirm">Password confirm</Label>
                            <Input type="password" name="passwordConfirm" id="examplePasswordConfirm" placeholder="Confirm your password" value={form.passwordConfirm} onChange={onChangeValue} />
                        </FormGroup>
                        {form.errors.passwordConfirmError ? 
                            <div style={{color:'red'}}>
                                {form.errors.passwordConfirmError}
                            </div>:
                             null}

                        <FormGroup>
                            <Label for="profilePicture">profile picture</Label>
                            <Input type="file" name="profilePicture" id="profilePicture" placeholder="Select a picture" onChange={selectImage}/>
                        </FormGroup>
                        {/* <FormGroup>
                            <Label for="exampleSelectMulti">Role choice</Label>
                            <Input type="select" name="role" id="exampleSelectMulti" multiple onChange={onChangeValue}>
                                <option value={"ROLE_USER"}>user</option>
                                <option value={"ROLE_ADMIN"}>admin</option>
                            </Input>
                        </FormGroup> */}
                        <FormGroup style={{margin:'20px', padding:'10px'}}>
                            <Label  >
                                <Input 
                                type="checkbox" label="isPro" name="isPro" id="isPro" checked={form.isPro}
                                onClick={onCheckCheckBox} 
                                /> 
                                 Etes vous professionnel <br></br>                       
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                            <Input type="checkbox" onClick={accepteCoditions}/>{' '}
                                Accepte conditions <br></br>
                            <Button color="secondary" style={{margin:5}} onClick={showConditions}>Learn more about our policy</Button>
                            </Label>
                        </FormGroup>
                        <Button id="btn_inscription" type="submit"  color="primary" disabled={!conditionsAccepted}>
                        Inscription 
                        <br></br>{conditionsAccepted===false? <p style={{color:'#f00'}}>You must accepte conditions</p>:null}
                        </Button>
                    </Form>
                </div> 
            </div>  
            <div>
                <Modal isOpen={modal} toggle={toggle} scrollable={true} >
                    <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
                    <ModalBody>
                        {modalTitle !== 'Our policy confidential' ?
                        <div className="divImage">
                            <img className="modalImage" src={modalImage} alt="pictur response" />
                        </div>: null   
                        }
                        {modalBody}       
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" disabled={modalButtonDisabled} onClick={toggle}>OK</Button>{' '}
                    {/* <Button color="secondary" onClick={toggle}>Cancel</Button> */}
                    </ModalFooter>
                </Modal>
            </div>

        </div>

    )
}

export default Signup;