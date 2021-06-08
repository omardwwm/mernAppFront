import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from "react-redux";
import {deletUser} from "../../redux/actions/UserActions";
import {useHistory} from "react-router-dom";
import {changePassword} from "../../redux/actions/UserActions";
import {Card, CardText, CardBody, CardTitle, Button, Collapse, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import "./profile.css"
import axios from 'axios';


const Profile = ()=>{
    const dispatch = useDispatch();
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('myUser'));
    const token = localStorage.getItem('userToken');
    const userId = (user && user.id) ? user.id : user && user._id;
    const [newProfilePicture, setNewProfilePicture] = useState("");
    // console.log(user);
    // const [successMsg, setSuccessMsg] = useState(useSelector(state=>state.userReducer.successMsgPasswordChange));
    const successMsg = useSelector(state=>state.userReducer.successMsgPasswordChange);
    const modalBody = useSelector(state=>state.userReducer.modalBodyDeleteUser);
    const [modal, setModal] = useState(false);
    const [test, setTest] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [errorUpdateImg, setErrorUpdateImg] = useState('');
    const [form, setForm] = useState({
        newPassword:"",
        newPasswordConfirm: "",
        errors:{
            passwordError: "",
            passwordConfirmError: ""
        }
    })

    const toggleModal = () =>{
        setModal(!modal);
    } 
    // const config = {headers: {
    //     Accept:'application/json, text/plain, */*',
    //     'Content-Type': '*',
    //     'Authorisation': `Bearer ${token}`,
    //     "x-auth-token":`${token}`
    // }};

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const [isPicOpen, setIsPicOpen] = useState(false);
    const togglePic = () => setIsPicOpen(!isPicOpen);
    const deleteMyAccount =()=>{
        // console.log(token);
        const myCurrentProfilePicture = user.profilePicture;
        if(window.confirm('Vous etes sur de vouloir supprier votre compte?')){
            dispatch(deletUser(userId, myCurrentProfilePicture, token)).then(setModal(true)).then(()=>setTimeout(() => {
                history.push("/");
                setModal(false);
                }, 4000))
            }      
    }

    const onChangeValue=(event)=>{
        event.preventDefault();
        const { name, value} = event.target; 
        let errors = form.errors;
        setSubmitError('')
        switch (name) {
            case 'newPassword': 
              errors.passwordError = 
                value.length < 6
                  ? 'Password must be 6 characters long!'
                  : '';
              break;
            case 'newPasswordConfirm':
                errors.passwordConfirmError =
                form.newPassword !== value ? 
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
        console.log(form)
    }

    const selectImage = (event)=>{
        event.preventDefault();
        setErrorUpdateImg('');
        setNewProfilePicture(event.target.files[0]);     
    }

    useEffect(()=>{
        setTest(successMsg);
    }, [successMsg]);
    // console.log('testIs: ', test)
    const updatePassword=async(e)=>{
        e.preventDefault();
        const newPassword = form.newPassword;
        const newPasswordConfirm = form.newPasswordConfirm;
        const userId = user.id
        // const config = {headers: {
        //     Accept:'application/json, text/plain, */*',
        //     'Content-Type': 'application/json;charset=UTF-8',
        //     'Authorisation': `Bearer ${token}`,
        //     "x-auth-token":`${token}`
        // }};
        // console.log(form);
        // console.log(newPassword);
        // console.log(newPasswordConfirm);
        // dispatch(changePassword(userId, token, newPassword, newPasswordConfirm))
        if(newPassword && newPasswordConfirm){
            // console.log(successMsg);
            dispatch(changePassword(userId, token, newPassword, newPasswordConfirm));
            // setTimeout(() => {
            //     history.push('/');       
            // }, 4000);
            setTimeout(() => {
                setForm({
                    ...form,
                    newPassword:"",
                    newPasswordConfirm: "",
                });
                setTest('');
                setIsOpen(false);
                // history.push('/')
            }, 4000);
            // setSuccessMsg('');    
        }else{
            setSubmitError('Vous devez remplir tous les champs')
        }   
    }

    // Function to update image of profile
    const [msgUpdateImgSuccess, setMsgUpdateImgSuccess] = useState('')
    const sendNewImage=async(e)=>{
        e.preventDefault();
        const config = {headers: {
            Accept:'*/*',
            'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
            'Authorisation': `Bearer ${token}`,
            "x-auth-token":`${token}`
        }};
        const formData = new FormData();
        if(newProfilePicture){
            formData.append('profilePicture',newProfilePicture);
            formData.append('oldProfilePicture',user.profilePicture);

             await axios.put(`https://mern-recipes.herokuapp.com/users/updatePicture/${userId}`, formData, config)
            .then(res=>{
                console.log(res);
                setMsgUpdateImgSuccess(res.data.message);
                localStorage.setItem('myUser', JSON.stringify(res.data.updatedUser))
            }).then(()=>setTimeout(() => {
                setIsPicOpen(false);
                setMsgUpdateImgSuccess('');
            }, 3000))
        }else{
            // formData.append('oldProfilePicture',user.profilePicture); 
            setErrorUpdateImg('Vous devez choisir une image')
        }
    }
    // console.log(msgUpdateImgSuccess);

    useEffect(()=>{
        JSON.parse(localStorage.getItem('myUser'));
        localStorage.getItem('userToken');
        setTest('');
        
    }, [])

    // console.log(user);
    // console.log('successMessage is:', successMsg); 
    // console.log(submitError);
    console.log(modalBody);
    return(
        <>
            <h2>Mes infos</h2>
            <Card id="profileCardParent" >
                <Card className="profileCard col-md-7 col-xs-12">
                    <CardBody>
                        <CardTitle tag="h5">{user.username}</CardTitle>
                        <CardText>Email: {user.email}</CardText>
                        <img className="imgCard"
                            // src={`https://mern-recipes.herokuapp.com${user.profilePicture}`}
                            src={user.profilePicture}
                            alt="user pictureProfile"
                            />
                        <Button onClick={togglePic} size="sm">Changer votre photo</Button>
                        <Collapse isOpen={isPicOpen}>
                            <Card className="collapsCard col-md-11 col-sm-12">
                                <CardBody>
                                <Form onSubmit={sendNewImage}>
                                    <FormGroup>
                                        <Label for="newProfilePicture">Choisir une autre photo</Label>
                                        <Input type="file" name="newProfilePicture" id="newProfilePicture" placeholder="Select a picture" onChange={selectImage}/>
                                        <CardText>{msgUpdateImgSuccess}</CardText>
                                        <CardText style={{color:'#0f0'}}>{errorUpdateImg}</CardText>
                                        <Button id="btn_newPicture" type="submit" color="primary" size="sm">Envoyer</Button>
                                    </FormGroup>
                                </Form>
                                </CardBody>
                            </Card>
                        </Collapse>
                        <Button onClick={toggle} color="warning" size="sm">Modifier mon mot de passe</Button>
                        <Collapse isOpen={isOpen}>
                            <Card className="collapsCard col-md-9 col-sm-12">
                                <CardBody>
                                    <Form onSubmit={updatePassword}>
                                        <FormGroup>
                                            {/* <Label for="examplePassword">Nouveau mot de passe</Label> */}
                                            <Input type="password" name="newPassword" id="examplePassword" placeholder="Entrer le nouveau mot de passe" value={form.newPassword} onChange={onChangeValue} />
                                            {form.errors.passwordError ? 
                                            <div style={{color:'red'}}>
                                                {form.errors.passwordError}
                                            </div>:
                                            null}                                   
                                        </FormGroup>
                                        <FormGroup>
                                            {/* <Label for="examplePasswordConfirm">Confirmer le Nouveau mot de passe</Label> */}
                                            <Input type="password" name="newPasswordConfirm" id="examplePasswordConfirm" placeholder="Confirmation du mot de passe" value={form.newPasswordConfirm} onChange={onChangeValue} />
                                            {form.errors.passwordConfirmError ? 
                                            <div style={{color:'red'}}>
                                                {form.errors.passwordConfirmError}
                                            </div>:
                                            null}
                                        </FormGroup>
                                        <p style={{color:'#f0f'}}>{submitError && submitError}</p>
                                        
                                        <Button id="btn_password" type="submit" color="primary" size="sm">Envoyer</Button>
                                        <p style={{color:'#000'}}>{test && test}</p>
                                    </Form>    
                                </CardBody>
                            </Card>
                        </Collapse>
                    </CardBody>   
                </Card>
                <Card className="presentationCard col-md-5 col-xs-12" >
                    <CardBody>
                        <CardText>Presentation (TODO/ADD) .</CardText>
                    </CardBody>
                </Card>
            </Card>
            {/* <div> */}         
                <Button onClick={deleteMyAccount} color="danger" size="sm">Supprimer mon compte</Button>
            {/* </div> */}
            <Modal isOpen={modal} toggle={toggleModal} >
                    <ModalHeader toggle={toggleModal}>Triste de vous voir partir</ModalHeader>
                    <ModalBody>
                        {modalBody && modalBody}       
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={toggleModal}>OK</Button>{' '}
                    </ModalFooter>
                </Modal>
        </>
    )
} 

export default Profile;