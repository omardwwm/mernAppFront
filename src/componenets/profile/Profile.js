import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from "react-redux";
import {deletUser} from "../../redux/actions/UserActions";
import {useHistory} from "react-router-dom";
import {changePassword} from "../../redux/actions/UserActions";
import {Card, CardText, CardBody, CardLink, CardTitle, CardSubtitle, Button, Collapse, Form, FormGroup, Label, Input} from 'reactstrap';
import "./profile.css"


const Profile = ()=>{
    const dispatch = useDispatch();
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('myUser'));
    const token = localStorage.getItem('userToken');
    const userId = user.id;
    // console.log(userId);
    // const [successMsg, setSuccessMsg] = useState(useSelector(state=>state.userReducer.successMsgPasswordChange));
    const successMsg = useSelector(state=>state.userReducer.successMsgPasswordChange);
    const [test, setTest] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [form, setForm] = useState({
        newPassword:"",
        newPasswordConfirm: "",
        errors:{
            passwordError: "",
            passwordConfirmError: ""
        }
    })

    const config = {headers: {
        Accept:'application/json, text/plain, */*',
        'Content-Type': '*',
        'Authorisation': `Bearer ${token}`,
        "x-auth-token":`${token}`
    }};

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const deleteMyAccount =()=>{
        if(window.confirm('Vous etes sur de vouloir supprier votre compte?')){
            dispatch(deletUser(userId, config)).then(()=>history.push('/'))
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

    useEffect(()=>{
        setTest(successMsg);
    }, [successMsg])
    console.log('testIs: ', test)
    const updatePassword=async(e)=>{
        e.preventDefault();
        const newPassword = form.newPassword;
        const newPasswordConfirm = form.newPasswordConfirm;
        const userId = user.id
        const config = {headers: {
            Accept:'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorisation': `Bearer ${token}`,
            "x-auth-token":`${token}`
        }};
        console.log(form);
        console.log(newPassword);
        console.log(newPasswordConfirm);
        // dispatch(changePassword(userId, token, newPassword, newPasswordConfirm))
        if(newPassword && newPasswordConfirm){
            console.log(successMsg);
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

    useEffect(()=>{
        localStorage.getItem('myUser');
        localStorage.getItem('userToken');
        
    }, [])

    // console.log(user);
    console.log('successMessage is:', successMsg); 
    // console.log(submitError);
    return(
        <div>
            <h2>Mes infos</h2>
            <div>
                <Card id="profileCard" >
                    <CardBody>
                        <CardTitle tag="h5">{user.username}</CardTitle>
                        <p>Email: {user.email}</p>
                        {/* <CardSubtitle tag="h6" className="mb-2 text-muted">Card subtitle</CardSubtitle> */}
                    </CardBody>
                        <img className="imgCard"  src={user.profilePicture} alt="Card image cap" />
                    <CardBody>
                        <CardText>Presentation (TODO/ADD) .</CardText>
                        <CardLink href="#">Modifier mon mot de passe</CardLink>
                        {/* <CardLink href="#">Modifier mon profil</CardLink> */}
                        <Button onClick={toggle}>Modifier mon mot de passe</Button>
                        <Collapse isOpen={isOpen}>
                            <Card>
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
                                        
                                        <Button id="btn_password" type="submit"  color="primary">Envoyer</Button>
                                        <p style={{color:'#000'}}>{test && test}</p>
                                    </Form>    
                                </CardBody>
                            </Card>
                        </Collapse>
                    </CardBody>
                </Card>
                <Button onClick={deleteMyAccount}>Supprimer mon compte</Button>
            </div>
        </div>
    )
}

export default Profile;