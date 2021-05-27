import React, {useState, useEffect} from "react";
// import axios from "axios";
import {useSelector, useDispatch} from "react-redux";
import { withRouter } from "react-router";
import {login} from "../../redux";
import {useHistory} from "react-router-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';



const Auth = (props)=>{

    const dispatch = useDispatch();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    // const [token, setToken] = useState(null);
    const showModale = useSelector(state => state.userReducer.showModale)
    // console.log(showModale);
    const [logged, setLogged] = useState(useSelector(state=>state.userReducer.isUserLogged));
    const isUserLogged = useSelector(state=>state.userReducer.isUserLogged);
    console.log(isUserLogged);
    console.log('isuserloggedafterauth', logged);
    const [loginMessage, setLoginMessage] = useState('');
    const [modal, setModal] = useState(showModale);
    const modalBody = useSelector(state=>state.userReducer.modalBody)
    const modalTitle = useSelector(state=> state.userReducer.modalTitle);
    const toggle = () => setModal(!showModale);
    const token = useSelector(state=>state.userReducer.userToken)
    const validEmailRegex = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
    let [emailError, setEmailError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const user = useSelector(state => state.userReducer.user);
    const history = useHistory();

    useEffect(()=>{
        localStorage.getItem("userToken");
       setLoginMessage(modalBody);
       if(isUserLogged === true){
        setTimeout(() => {
            history.push("/recipes")
        }, 3000);
    }    
        
    }, [isUserLogged]);
    // useEffect(()=>{
    //     localStorage.getItem("userToken")
    //     setModal(showModale);
    //     setLogged(isUserLogged);
    //     if(isUserLogged === true){
    //         setTimeout(() => {
    //             history.push("/recipes")
    //         }, 3000)}
    // }, [isUserLogged])

    // console.log(token);

    const onChangeEmail=(e)=>{
        e.preventDefault();
        setEmail(e.target.value);
        emailError = validEmailRegex.test(e.target.value) ? setEmailError('') : setEmailError('NOT VALID EMAIL')
       
    }
//  console.log(emailError);
    const onChangePassword=(e)=>{
        e.preventDefault();
        setPassword(e.target.value);
        setSubmitError('');
    }

    const userLogin = event => {
        event.preventDefault();
        if(!email || !password){
            setSubmitError('Vous devez renseigner les deux champs')
        }else{
             dispatch(login(email, password))
             setLoginMessage(modalBody);
             setLogged(isUserLogged)
            //  setModal(showModale)
            //  .then(()=>setModal(showModale)).then(()=>setLogged(isUserLogged))            
            //  .then(
            //      ()=>
            //  setTimeout(() => (
            //     history.push("/recipes")
            //  ), 5000)
            //  )
           
        }
        if(isUserLogged === true){
            setTimeout(() => {
                history.push("/recipes")
            }, 3000);
            
            console.log("test logged ok")
        }    
        // setToken(localStorage.setItem("userToken", myToken));
    }

    // console.log(user);

    return(
        <div>
            <h1>THIS IS AUTHENTIFICATION PAGE</h1>
            <h2>Formulaire to implement here!!</h2>

            <h3>Se connecter a votre compte</h3>
            <div className="row mt-5">
                <div className="col-8">
                    <form onSubmit={userLogin} className="container d-inline-block col-lg-12">
                            <div className="form-group">
                                {/*<label htmlFor="email">Email</label>*/}
                                <input
                                    type="email"
                                    className="form-control"
                                    id="inlineFormInputGroup"
                                    placeholder="email"
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
                            {/* <div className="form-group">
                            <input
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    name="photo"
                                    className="form-control"
                                    id="pictureExample"
                                    placeholder="Select a picture"
                                    onChange={()=>{console.log('test pictur')}}
                                />
                            </div> */}
                            <button type="submit" className="btn btn-primary col-lg-2 col-sm-3">Entrer</button>
                    </form>
                </div>
            </div>
            {user && user ? 
            <div>
                <img src= {`${user.profilePicture}`} style={{height:'200px', width:"400px", margin:"40px"}} alt="test pic" />
                <p>{user.username}</p>
                <p>{user.email}</p>
            </div> 
            : null}
          {modalBody && <div>
              <p style={{color:'#f0f'}}>{modalBody}</p>
              </div>}
        </div>
       
    )
}

export default withRouter (Auth);