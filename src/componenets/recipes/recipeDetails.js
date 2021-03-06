import React, {useEffect, useState, useRef} from "react";
// import {getAllRecipes} from "../../redux";
import axios from "axios";
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw, ContentState} from 'draft-js';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Card } from 'reactstrap';
import {deleteRecipe, getOneRecipe, postComment} from "../../redux/actions/RecipeActions";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, Link} from "react-router-dom";
import {formatDate} from "../../outils/outils";

const RecipeDetails = (props)=>{    
    const recipeId = props.match.params._id;
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    // console.log(currentPath);
    const dispatch = useDispatch();
    const history = useHistory();
    const thisRecipe = useSelector(state=> state.recipeReducer.recipe);
    // const testRecipe = useSelector(state=> state.recipeReducer.recipe);
    // const savedRecipe = JSON.parse(localStorage.getItem('thisRecipe'));
    const [testRecipe, setTestRecipe ]= useState([]);
    // const test = localStorage.thisRecipe;
    // console.log(test); 
    // console.log(localStorage); 
    // console.log('recipeFromReducer', thisRecipe);
    // console.log('recipe is',testRecipe);
    // const test2 = localStorage.thisRecipe && JSON.parse(localStorage.thisRecipe).recipeName;
    // console.log(test2);    
    const token = localStorage.getItem('userToken');
    // console.log(token); 
    // const user = localStorage.getItem('myUser');
    // const [user, setUser] = useState(null);
    const user = localStorage.getItem('myUser') && JSON.parse(localStorage.getItem('myUser'));
    console.log(user);

    // const getUser = ()=>{
    //     if(JSON.parse(localStorage.getItem('myUser'))){
    //         const storedUser = JSON.parse(localStorage.getItem('myUser'))
    //         setUser(storedUser);
    //         console.log(storedUser);
    //     }
    //     getUser();
    // }
    const userId = user &&  user.id ? user.id : user && user._id;
    console.log('userID Is:', userId);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!showModale);
    const modalTitle = useSelector(state=>state.recipeReducer.modalTitle);
    const modalBody = useSelector(state=>state.recipeReducer.modalBody);
    const showModale = useSelector(state => state.recipeReducer.showModale)
    // console.log(showModale); 
    // console.log(modal);
    // const config = {headers: {
    //     'Authorisation': `Bearer ${token}`,
    //     "x-auth-token":`${token}`
    // }};
    // const config = {headers: {
    //     Accept:'*/*',
    //     'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
    //     'Authorisation': `Bearer ${token}`,
    //     "x-auth-token":`${token}`
    // }};
    // console.log(recipeId);
    const htmlInstructions = testRecipe && testRecipe.recipeDescription && stateToHTML(convertFromRaw(JSON.parse(testRecipe.recipeDescription)));
    // const htmlInstructions = testRecipe && stateToHTML(convertFromRaw(testRecipe.recipeDescription));
    // console.log(thisRecipe && JSON.parse(thisRecipe.recipeDescription));
    // const state1 = ContentState.createFromBlockArray(
    //     instructionsTest.contentBlock,
    //     instructionsTest.entityMap,
    //   );
    //   console.log(state1);
    // console.log(testRecipe.recipeDescription);
    const ingredients = testRecipe && testRecipe.recipeIngrediants;
    const [commentContent, setCommentContent] = useState('');
    const [errorComment, setErrorComment] = useState('')
    const handleChangeComment =(e)=>{
        e.preventDefault();
        setErrorComment('');
        setCommentContent(e.target.value)
        // setCommentContent(JSON.stringify(e.target.value));
        // if(e.target.value == "" || e.target.value == null){
        //     setCommentContent(e.target.value)
        // }  
    }

    const sendComment =(e)=>{
        e.preventDefault();
        const config = {headers: {
            'Authorisation': `Bearer ${token}`,
            "x-auth-token":`${token}`
        }};
        if(user && token){
            if(commentContent){
                dispatch(postComment(recipeId, userId, commentContent, config)).then(setModal(true)).then(setCommentContent("")).then(()=>setTimeout(() => {
                    setModal(false)
                }, 2000)).then(()=>fetchRecipe()); 
                ;
                // console.log(commentContent)  
                }else{
                    setErrorComment('Vous devez ecrire le commentaire avant de l\'envoyer')
                }
        }else{
            setErrorComment('Vous devez vous connecter pour pouvoir poster des commentaires');
        }  
    }
    
    const deleteThisRecipe=()=>{
        const token = localStorage.getItem('userToken');
        let recipeId = testRecipe._id;
        const dataToDelete = JSON.stringify(testRecipe.recipePicture);
        console.log(dataToDelete);
        // console.log(JSON.stringify(dataToDelete));
        if(window.confirm('vous voulez supprimer cette recette?')){
            dispatch(deleteRecipe(recipeId, dataToDelete, token)).then(()=>setTimeout(() => {
                history.push(`/recipes`)
            }, 4000)); 
        }     
    }
    const currentRecipeComments = testRecipe && testRecipe.comments && testRecipe.comments;
    // console.log(currentRecipeComments);

    const fetchRecipe =async()=>{
        await axios.get(`http://localhost:8080/recipes/${recipeId}`).then(response=>{
            setTestRecipe(response.data);
        })      
    } 
    testRecipe && console.log('recipeFinalIs', testRecipe.recipeCreator);
    const idFromRecipe = testRecipe.recipeCreator;
    // idFromRecipe == userId ? console.log('okkkk'): console.log('not working')
    // const isMine = (testRecipe.recipeCreator ===user && user.id || testRecipe.recipeCreator===user && user._id) ? true : false;    
    const isMine = idFromRecipe == userId ? true : false;
    console.log(isMine);

    useEffect(()=>{
        const { pathname } = window.location;
        // dispatch(getOneRecipe(recipeId));
        fetchRecipe();
        // getUser();
        setCurrentPath(pathname);   
        // if(JSON.parse(localStorage.getItem('thisRecipe'))){
        //     const recipeFromStorage = JSON.parse(localStorage.getItem('thisRecipe'));
        //     setTestRecipe(recipeFromStorage); 
        // }
        localStorage.getItem('userToken');
        // console.log(currentPath)
    },[]);     

    // useEffect(()=>{
    //     localStorage.setItem('myUser', JSON.stringify(user)); 
    // }, [user]);   

    // console.log(isMine);
    // console.log('comments are: ',testRecipe.comments)
    // if(!testRecipe){
    //     return (
    //         <p>Nothing to show</p>
    //     )
    // }
    return(
        // <h2>details recipe page</h2>
        <div className="recipeDetails">
            <h2>Recipe detailes pages</h2>
            <div className="recipeDetailsContent">
                <h3>Recipe of: {testRecipe.recipeName}</h3>
                <p>Creation of the chief: {testRecipe.recipeCreatorName}</p>
                <img src={`http://localhost:8080${testRecipe.recipePicture}`} style={{width:'60%', height:'300px'}} />
                <h3>The ingredients</h3>
                {ingredients && ingredients.map((ing, index)=> (
                    <ul key={index}>{ing.ingredientName}: {ing.quantity} </ul>
                ))}
                {/* <p>{myRecipe.recipeDescription}</p> */}
                <div className="instructions">
                    <h4>les instructions</h4>
                    {/* <div dangerouslySetInnerHTML={{__html: currentRecipe.recipeDescription}} />  */}
                    <div dangerouslySetInnerHTML={{__html: htmlInstructions}} />      
                </div>   
            </div>
            <div style={{border:'solid 2px #fff', marginTop:'5px', padding:'6px'}}>
                <Form onSubmit={sendComment} >
                    <Label for="comment">commentaires</Label>
                    <Input type="textarea" name="comment" id="comment" value={commentContent} placeholder="Enter un commentaire" onChange={handleChangeComment} />
                    <Button>Poster</Button>
                    <span style={{color:'red'}}>{errorComment}</span>
                </Form>
                <div style={{border:'solid 2px gold', margin:'5px'}}> 
                    {testRecipe && testRecipe.comments && testRecipe.comments.length > 0? 
                    (
                        // console.log('comments are: ',testRecipe.comments)
                        <>
                        <h4>Les commentaires</h4>
                        { testRecipe.comments.map((comment, index)=>
                            (
                                    <div key={index} style={{color:'#0ff8ff'}}>
                                        <Card id="commentCard">
                                            <div>
                                                <img src={comment && comment.userId && comment.userId.profilePicture} className="commentImage" /> {comment.userId && comment.userId.username}&nbsp;{formatDate(comment.postedAt)}
                                            </div> 
                                            <div className="d-inline-block offset-1">
                                                <p >{comment.commentText}</p>{' '}
                                            </div>    
                                        </Card>    
                                    </div>
                                )                                             
                            )}
                        </>                   
                    ): 
                    (
                        <div>
                            <p>Pas de commentaires, postez un</p>
                        </div>
                    ) 
                    }
                </div>
            </div>
            
            { (token && isMine)? 
            <>
                {/* <Button onClick={deleteThisRecipe}>Update</Button> */}
                <Link to={{pathname: `/updateRecipe/${testRecipe._id}`, state:{testRecipe}}} ><span style={{color:'#fff'}}>Update</span></Link>
                <Button onClick={deleteThisRecipe}>SUPPRIMER</Button>  
            </>       
            : null}

            <Modal isOpen={modal} toggle={toggle} scrollable={true} >
                <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
                <ModalBody>
                    {modalBody}       
                </ModalBody>
                <ModalFooter>
                <Button color="primary"  onClick={toggle}>OK</Button>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>          
        </div>        
    )
}

export default RecipeDetails;