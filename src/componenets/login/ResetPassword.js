import React, {useState} from 'react';
import axios from "axios";
import {FormGroup, Input, Button, Form, Collapse} from 'reactstrap';


const ResetPassword =(props)=>{

    const [submitError, setSubmitError] = useState('');
    const [errorUpdateImg, setErrorUpdateImg] = useState('');
    const [test, setTest] = useState('');
    console.log(props.match.params)

    const [form, setForm] = useState({
        newPassword:"",
        newPasswordConfirm: "",
        errors:{
            passwordError: "",
            passwordConfirmError: ""
        }
    })

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

    const resetPassword=async(e)=>{
        e.preventDefault();
        try {
            const newPassword = form.newPassword;
            const newPasswordConfirm = form.newPasswordConfirm;
            const {id, token} = props.match.params;
            
            console.log(form);
            // const formData = new FormData();
            // formData.append('newPassword', form.newPassword);
            // formData.append('newPasswordConfirm', form.newPasswordConfirm)
            const data = {
                newPassword: form.newPassword,
                newPasswordConfirm: form.newPasswordConfirm
            }
            console.log(newPassword);
            console.log(newPasswordConfirm);
            // dispatch(changePassword(userId, token, newPassword, newPasswordConfirm))
            if(newPassword && newPasswordConfirm){
                console.log('test Reset function')
                const headers = {
                    Accept:'*/*',
                    'content-type':'application/json' 
                    };
                const response = await axios.put(`http://localhost:8080/reset/change-password/${id}/${token}`, data, {headers} );
                console.log(response.data);
                // console.log(successMsg);
                // dispatch(changePassword(userId, token, newPassword, newPasswordConfirm));
                // setTimeout(() => {
                //     history.push('/');       
                // }, 4000);
                // setTimeout(() => {
                //     setForm({
                //         ...form,
                //         newPassword:"",
                //         newPasswordConfirm: "",
                //     });
                //     setTest('');
                //     setIsOpen(false);
                //     // history.push('/')
                // }, 4000);
                // setSuccessMsg('');    
            }else{
                setSubmitError('Vous devez remplir tous les champs')
            }   
        } catch (error) {
            console.log(error)
        }
       
    }

    return(
        <div>
            <h3>Form reste password</h3>
            <Form onSubmit={resetPassword}>
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
        </div>
    )
}

export default ResetPassword;