import React, {useState, useEffect} from "react";
import axios from "axios";
import {useSelector, useDispatch} from "react-redux";
import { withRouter } from "react-router";
import {login} from "../../redux";
import {useHistory} from "react-router-dom";
import ForgotPassword from "./ForgotPaasword";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Collapse, Card, CardBody } from 'reactstrap';



const Auth = (props)=>{

    const dispatch = useDispatch();
    // const [email, setEmail] = useState(null);
    // const [emailToReset, setEmailToReset] = useState(null);
    const [ inputs, setInputs] = useState('');
    const [password, setPassword] = useState(null);
    // const [token, setToken] = useState(null);
    // collapse for forgotPassword
    const [isOpen, setIsOpen] = useState(false);
    const toggleCollapse = (e) =>{
        const {name} = e.target
        setIsOpen(!isOpen);
        setInputs(state=>({...state, name:''}))
    } 
    const [logged, setLogged] = useState(useSelector(state=>state.userReducer.isUserLogged));
    const isUserLogged = useSelector(state=>state.userReducer.isUserLogged);
    console.log(isUserLogged);
    console.log('isuserloggedafterauth', logged);
    // const [loginMessage, setLoginMessage] = useState('');
    const modalBody = useSelector(state=>state.userReducer.modalBody)
    const token = useSelector(state=>state.userReducer.userToken)
    const validEmailRegex = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
    let [emailError, setEmailError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const user = useSelector(state => state.userReducer.user);
    const history = useHistory();

    useEffect(()=>{
        localStorage.getItem("userToken");
        // setLoginMessage(modalBody);
        if(isUserLogged === true){
            setTimeout(() => {
                history.push("/recipes")
            }, 3000);
    }        
    }, [isUserLogged]);

    const [msgUrlReset, setMsgUrlReset]= useState('');
    const [errorEmailReset, setErrorEmailReset]= useState('');

    const onChangeEmail=(e)=>{
        e.preventDefault();
        const {name, value} = e.target
        switch (name) {
            case 'email': 
            validEmailRegex.test(value) ? setEmailError('') : setEmailError('NOT VALID EMAIL')
              break;
            case 'emailToReset': 
            validEmailRegex.test(value) ? setErrorEmailReset('') : setErrorEmailReset('NOT VALID EMAIL')
              break;
              default:
                break;
        }
        // setEmail({name:e.target.value});
        setInputs({name:e.target.value})
        // emailError = validEmailRegex.test(e.target.value) ? setEmailError('') : setEmailError('NOT VALID EMAIL') 
    }
//  console.log(emailError);
    const onChangePassword=(e)=>{
        e.preventDefault();
        setPassword(e.target.value);
        setSubmitError('');
    }
// send urlREST 
    const sendUrl=async(e)=>{
        e.preventDefault();
        if(inputs.name){
           try {
            const response = await axios.post(`http://localhost:8080/reset/send-url/${inputs.name}`);
            console.log(response.data);
            setMsgUrlReset(response.data.message)
        } catch (error) {
            console.log(error.response.data);
            setMsgUrlReset(error.response.data.message)
        } 
        }else{
            setErrorEmailReset('vous devez saiair un email !')
        }  
    }
    // console.log('email in login component', inputs.name);

    const userLogin = event => {
        event.preventDefault();
        if(!inputs.name || !password){
            setSubmitError('Vous devez renseigner les deux champs')
        }else{
             dispatch(login(inputs.name, password))
            //  setLoginMessage(modalBody);
             setLogged(isUserLogged)
        }
        if(isUserLogged === true){
            setTimeout(() => {
                history.push("/recipes")
            }, 3000);
        }    
    }
    console.log(modalBody);

    return(
        <div>
            <h3>Se connecter a votre compte</h3>
            <div className=" row mt-5">
                <div className="col-6 " >
                    <form onSubmit={userLogin} className="container d-inline-block col-lg-10">
                            <div className="form-group">
                                {/*<label htmlFor="email">Email</label>*/}
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    id="inlineFormInputGroup"
                                    placeholder="email"
                                    value={inputs.name}
                                    onChange={onChangeEmail}
                                />
                            </div>
                                {emailError? 
                                    <div style={{color:"#f0f"}} >
                                        {emailError}
                                    </div>:
                                    null
                                }

                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    id="password-field1"
                                    placeholder="Mot de passe"
                                    onChange={onChangePassword}
                                />
                            </div>
                            {submitError && 
                                <div>
                                    <p style={{color:'#00f'}}>{submitError}</p>
                                </div>}
                            <Button type="submit" color="primary" size="sm">Se connecter</Button>
                    </form>
                </div>
                <div className="col-5">
                    <Button onClick={toggleCollapse} color="warning" size="sm">Mot de passe oublie?</Button>
                    <Collapse isOpen={isOpen}>
                        <Card>
                            <CardBody>
                                <ForgotPassword value={inputs.name} sendUrl={sendUrl} handleChange={onChangeEmail} messageResponse={msgUrlReset} errorEmailReset={errorEmailReset} name="emailToReset"  />
                            </CardBody>
                        </Card>                    
                    </Collapse>
                </div>   
            </div>
          {modalBody && <div>
              <p style={{color:'#f0f'}}>{modalBody}</p>
              </div>}
        </div>
       
    )
}

export default withRouter (Auth);