import React, {useState, useEffect} from "react";
import {Form, FormGroup, Label, Input, Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useSelector, useDispatch} from "react-redux";
// import { Redirect } from 'react-router';
import { EditorState, convertToRaw, convertFromHTML, convertFromRaw, ContentState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
// import draftToHtml from "draftjs-to-html";
import {stateToHTML} from 'draft-js-export-html'
import {RiAddCircleFill, RiDeleteBin6Fill} from "react-icons/ri"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./newRecipe.css";
import {updateRecipe} from "../../redux/actions/RecipeActions";
import {useHistory} from "react-router-dom";

const UpdateRecipe = (props)=>{

    const recipeToUpdate = props.location.state.testRecipe;
    console.log('recipe to update is:', recipeToUpdate);
    const [formRecipe, setFormRecipe] = useState({
        recipeName: recipeToUpdate.recipeName,
        recipeDescription: recipeToUpdate.recipeDescription,
        recipePreparationTime: recipeToUpdate.recipePreparationTime,
        recipeCookingTime: recipeToUpdate.recipeCookingTime,
        recipeCategory: recipeToUpdate.recipeCategory, 
        errors:{
            recipeNameError:"",
            recipePreparationTimeError:"",
            recipeCookingTimeError:"",
            recipeCategoryError:"",
        }
    });

    const history = useHistory();
    // const user = useSelector(state => state.userReducer.user);
    const user = JSON.parse(localStorage.getItem('myUser'));
    // console.log('user inside form', user);
    const token = localStorage.getItem('userToken');
    // console.log(token);
    // const willRedirect = useSelector(state=>state.recipeReducer.redirect);
    // const [willRedirect, setWillRedirect]= useState(redirect);
    const modalTitle = useSelector(state=>state.recipeReducer.modalTitle);
    const modalBody = useSelector(state=>state.recipeReducer.modalBody);
    const showModale = useSelector(state => state.recipeReducer.showModale)
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!showModale);
    const dispatch = useDispatch();
    // const [inputValue, setInputValue]=useState("");
    const[recipeIngrediants, setRecipeIngrediants] = useState([...recipeToUpdate.recipeIngrediants]);
    const [ingredientsError, setIngredientsError] = useState("");
    const [ingredientName, setIngredientName] = useState("");
    const [ quantity, setQauntity] = useState("");
    const recipeCreator = user && user.id;
    const recipeCreatorName = user && user.username;
    // console.log(recipeCreator);
    const handleChange = (event)=>{
        event.preventDefault();
        const {name, value} = event.target;
        let errors = formRecipe.errors;
        switch(name){
            case "recipeName":
                errors.recipeNameError = value.length < 2 || value.length == null? "Enter a recipe name please": "";
                break;
            case "recipeCategory":
                errors.recipeCategoryError = value === ""? "you must Selecte a cetegory": "";
                break;
            case "recipePreparationTime":
                errors.recipePreparationTimeError = value.length === ""? "enter a duration":"";
                break;
            case "recipeCookingTime":
                errors.recipeCookingTimeError = value.length === ""?"enter a duration":"";
                break;
            default:
                break;         
        }
        setFormRecipe({
            ...formRecipe,
            errors, [name]: value
        })
    }
    console.log(formRecipe);
    const onChangeIngredientName = (event)=>{
        setIngredientName(event.target.value)
    }
    const onChangeIngredientQauntity = (event)=>{
        setQauntity(event.target.value)
    }
    // console.log(recipeIngrediants);
    // console.log(recipeToUpdate.recipeDescription);

    const htmlInstructions = stateToHTML(convertFromRaw(JSON.parse(recipeToUpdate.recipeDescription)));
    // console.log(htmlInstructions);
    // const [instructions, setInstructions] = useState(EditorState.createWithContent((htmlInstructions.rowBlocks), null));

    const converted = convertFromHTML(htmlInstructions);
    // console.log(converted);

    
    const defaultInstructions = EditorState.createWithContent(
        ContentState.createFromBlockArray(
            converted
        )
    )
    // console.log(defaultInstructions);
  
    const [instructions, setInstructions] = useState(defaultInstructions);
    const onEditorStateChange = (editorState) => {
      setInstructions(editorState)
      }
    
    const[recipePicture, setRecipePicture] =useState(null);
    const selectImage = (event)=>{
        event.preventDefault();
        setRecipePicture(event.target.files[0])        
    };
    console.log(recipePicture);
    const addIngredient =(event)=>{
        event.preventDefault();
        if(ingredientName ==="" || quantity ===""){
            setIngredientsError("you must enter name and quantity of ingredient befor click adding")
        }else{
            const newIngredient = {
            ingredientName:ingredientName,
            quantity: quantity
        }
        const newIngredients = [...recipeIngrediants, newIngredient];
        setRecipeIngrediants(newIngredients);
        setIngredientName("");
        setQauntity("");
        setIngredientsError("");
        }      
    }

    const removeIngredient =(ing, index)=>{
        let filtredArray = [...recipeIngrediants];
        filtredArray.splice(index, 1)
        setRecipeIngrediants(filtredArray);
    }
    const handleSubmit =(event)=>{
        event.preventDefault();
        const recipeINgTest = recipeIngrediants;
        // console.log(recipeINgTest);
        const recipeToSend = JSON.stringify(recipeINgTest);
        // console.log(recipeToSend);
        const config = {headers: {
            Accept:'*/*',
            'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
            'Authorisation': `Bearer ${token}`,
            "x-auth-token":`${token}`
        }};
        let recipeId = recipeToUpdate._id
        const formData = new FormData();
        if(recipePicture){
            formData.append('recipePicture',recipePicture);
            formData.append('oldRecipePicture',recipeToUpdate.recipePicture);
        }else{
            formData.append('oldRecipePicture',recipeToUpdate.recipePicture);
        }
        console.log(recipePicture);
        // formData.append('recipePicture',recipePicture);
        formData.append('recipeName', formRecipe.recipeName);
        formData.append('recipeCategory', formRecipe.recipeCategory);
        // formData.append('recipeDescription', formRecipe.recipeDescription);
        formData.append('recipeDescription',  JSON.stringify(convertToRaw(instructions.getCurrentContent())));
        formData.append('recipePreparationTime', formRecipe.recipePreparationTime);
        formData.append('recipeCookingTime', formRecipe.recipeCookingTime);
        formData.append('recipeCreator', recipeCreator);
        formData.append('recipeCreatorName', recipeCreatorName);
        formData.append('recipeIngrediants', recipeToSend);
        dispatch(updateRecipe(recipeId, formData, config)).then(setModal(true)).then(()=>setTimeout(() => {
            history.push(`/recipes`);
            (setModal(false))
        }, 5000));
           
    }
    console.log('showModalIs:', showModale);
    useEffect(()=>{
        localStorage.getItem('myUser');
        localStorage.getItem('userToken');
    }, [])

    // console.log(recipePicture.name); 


    if(user){
        return (
            <div className="formNewRecipe">
                <h3>UPDATE THIS RECIPE</h3>
                <Form className="m-4 col-10 m-auto" encType="multipart/form-data" onSubmit={handleSubmit }>
                    <FormGroup className="col-5 m-auto">
                        <Label for="recipeName">Name of the recipe</Label>
                        <Input type="text" name="recipeName" id="recipeName" defaultValue={recipeToUpdate.recipeName} onChange={handleChange} />
                    </FormGroup>
                    {formRecipe.errors.recipeNameError?
                        <div style={{color:'red'}}>
                            {formRecipe.errors.recipeNameError}
                        </div>: null
                    }
                    <FormGroup className="col-5 m-auto">
                        <Label for="recipeCategory">Select a category</Label>
                        <Input type="select" name="recipeCategory" id="recipeCategory" placeholder="Choice a category" onChange={handleChange}>
                            <option defaultValue={recipeToUpdate.recipeCategory}>{recipeToUpdate.recipeCategory}</option>
                            <option value="entree">Entree</option>
                            <option value="plat">Plat</option>
                            <option value="dessert">Dessert</option>
                        </Input>
                    </FormGroup>
                    {formRecipe.errors.recipeCategoryError?
                        <div style={{color:'red'}}>
                            {formRecipe.errors.recipeCategoryError}
                        </div>: null
                    }
                    <FormGroup className="col-5 d-inline-block mt-4">
                        <Label for="ingredientName">Ingrediant name</Label>
                        <Input type="text" name="ingredientName" value={ingredientName} id="ingredientName" placeholder="Enter your recipe ingrediants" onChange={onChangeIngredientName} />
                    </FormGroup>
                    <FormGroup className="col-4 d-inline-block">
                        <Label for="quantity">Ingrediant quantity</Label>
                        <Input type="text" name="quantity" value={quantity} id="quantity" placeholder="Enter the quantity" onChange={onChangeIngredientQauntity} />
                    </FormGroup>
                    <Button className="mb-4" onClick={addIngredient}><RiAddCircleFill style={{fontSize:'22px', color:'#ff0'}}/> Add ingredient</Button>
                    {ingredientsError?(
                        <div style={{color:'red'}}>
                            <p>{ingredientsError}</p>
                        </div>
                    )
                    :null}
                    {recipeIngrediants.length >0 ?
                        (<div className="listIng">
                            <h4>Liste des ingredients</h4>
                            <ol>
                                {recipeIngrediants.map((ing, index)=>(
                                    <div className="" key={index}>
                                        <li className="d-inline-block ">
                                            {ing.ingredientName}:{"   "}{ing.quantity}
                                            <Button className="" onClick={removeIngredient}><RiDeleteBin6Fill style={{fontSize:'18px', color:'#ff0'}}/></Button>
                                        </li>
                                       
                                    </div>                       
                                ))}
                            </ol>
                        </div>) : null
                    }
                    <div className="m-3">
                        <FormGroup>
                            <Label for="recipeDescription">Instructions of the recipe</Label>
                            <Editor 
                                editorState={instructions}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                editorStyle={{ height: "200px" , padding: "10px", background:'#fff', color:'#000'}}
                                onEditorStateChange={onEditorStateChange}
                            />
                        </FormGroup>
                  
                    </div>
                   
                    <FormGroup className="col-6 d-inline-block">
                        <Label for="recipePreparationTime">Time of preparation</Label>
                        <Input type="text" name="recipePreparationTime" id="recipePreparationTime" defaultValue={recipeToUpdate.recipePreparationTime}  onChange={handleChange}/>
                    </FormGroup>
                    <FormGroup className="col-6 d-inline-block">
                        <Label for="recipeCookingTime">Time of cooking</Label>
                        <Input type="text" name="recipeCookingTime" id="recipeCookingTime" defaultValue={recipeToUpdate.recipeCookingTime}  onChange={handleChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="recipePicture">Image of the recipe</Label>
                        <div>
                            <h5>ancienne image</h5>
                            <img className="d-block m-2" 
                                // src={`https://mern-recipes.herokuapp.com${recipeToUpdate.recipePicture}`}
                                src={recipeToUpdate.recipePicture}
                                style={{width:'200px', height:'100px'}} 
                            />
                        </div>
                        <Input type="file" name="recipePicture" id="recipePicture" placeholder="Select a picture" onChange={selectImage}/>
                        {/* {recipePicture && <div>
                            <h5>nouvelle image</h5>
                            <img className="d-block m-2" src={recipePicture} style={{width:'200px', height:'100px'}} alt="test" />
                        </div>} */}
                         
                    </FormGroup>
                    {/* {modalBody ? (
                        <div style={{color:'#f0f'}}>
                            <p>{modalBody}</p>
                        </div>
                    ):null} */}
                    <Button type="submit" color="primary" style={{margin:5}}>
                        Update this recipe
                    </Button>
                </Form>
                <Modal isOpen={modal} toggle={toggle} scrollable={true} >
                        <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
                        <ModalBody>
                            {modalBody}       
                        </ModalBody>
                        <ModalFooter>
                        <Button color="primary"  onClick={toggle}>OK</Button>
                        </ModalFooter>
                    </Modal>
            </div>
            
        )
    }else{
        return <div>
            <p>vous devez vous connecter pour creer et ajouter vos recettes</p>
        </div>
    }

}

export default UpdateRecipe;