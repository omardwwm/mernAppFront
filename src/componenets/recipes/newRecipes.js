import React, {useState, useEffect} from "react";
import {Form, FormGroup, Label, Input, Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useSelector, useDispatch} from "react-redux";
import {createRecipe} from "../../redux/actions/RecipeActions";
import { Redirect } from 'react-router';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import {stateToHTML} from 'draft-js-export-html'
// import htmlToDraft from 'html-to-draftjs';
import {RiAddCircleFill, RiDeleteBin6Fill} from "react-icons/ri"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./newRecipe.css";
// import axios from "axios";
import {useHistory} from "react-router-dom";

const Recipes = ()=>{

    const [formRecipe, setFormRecipe] = useState({
        recipeName:"",
        recipeDescription: {},
        recipePreparationTime: "",
        recipeCookingTime:"",
        recipeCategory: "",
        errors:{
            recipeNameError:"",
            recipePreparationTimeError:"",
            recipeCookingTimeError:"",
            recipeCategoryError:"",
        }
        // recipeCreator: "",
        // recipeIngrediants: [{
        //     ingredientName: "",
        //     quantity: ""
        // }],
        // recipePicture: "",
    });

    const history = useHistory();
    // const user = useSelector(state => state.userReducer.user);
    const user = JSON.parse(localStorage.getItem('myUser'));
    console.log('user inside form', user);
    const token = localStorage.getItem('userToken');
    // console.log(token);
    const willRedirect = useSelector(state=>state.recipeReducer.redirect);
    // const [willRedirect, setWillRedirect]= useState(redirect);
    const modalTitle = useSelector(state=>state.recipeReducer.modalTitle);
    const modalBody = useSelector(state=>state.recipeReducer.modalBody);
    const showModale = useSelector(state => state.recipeReducer.showModale)
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!showModale);
    const dispatch = useDispatch();
    // const [inputValue, setInputValue]=useState("");
    const[recipeIngrediants, setRecipeIngrediants] = useState([]);
    const [ingredientsError, setIngredientsError] = useState("");
    const [ingredientName, setIngredientName] = useState("");
    const [ quantity, setQauntity] = useState("");
    const recipeCreator = user && user.id ? user.id : user && user._id;
    const recipeCreatorName = user && user.username;
    console.log(recipeCreator);
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
            // [event.target.name]:isFile? event.target.files[0] : event.target.value 
            // [event.target.name]:event.target.value,
            errors, [name]: value
        })
    }
    // console.log(formRecipe);
    const onChangeIngredientName = (event)=>{
        setIngredientName(event.target.value)
    }
    const onChangeIngredientQauntity = (event)=>{
        setQauntity(event.target.value)
    }
    // console.log(recipeIngrediants);

    const [instructions, setInstructions] = useState(EditorState.createEmpty())
    const onEditorStateChange = (editorState) => (
      setInstructions(editorState)
    //   console.log(draftToHtml(convertToRaw(instructions.getCurrentContent())))
      );
    
    // console.log(instructions);   

    const[recipePicture, setRecipePicture] =useState("");
    const selectImage = (event)=>{
        event.preventDefault();
        // const file = event.target.files[0];
        // let reader = new FileReader();
        // reader.readAsDataURL(file);
        setRecipePicture(event.target.files[0])

        // setFormRecipe({
        //     ...formRecipe,
        //     recipePicture: file
        // })
        // reader.onloadend = ()=>{
        //     setFormRecipe({
        //         ...formRecipe,
        //         recipePicture:reader.result
        //     });
        //     console.log(reader);
        // }      
        // reader.readAsDataURL(file)   
    };
    // console.log(recipePicture);
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

    useEffect(()=>{
        setModal(false);
    }, [])
    const removeIngredient =(ing, index)=>{
        let filtredArray = [...recipeIngrediants];
        filtredArray.splice(index, 1)
        // const filtredArray = recipeIngrediants.filter(ing => ing.ingredientName !== item.ingredientName);
        setRecipeIngrediants(filtredArray);
    }
    const handleSubmit =(event)=>{
        event.preventDefault();
        const recipeINgTest = recipeIngrediants;
        console.log(recipeINgTest);
        // formRecipe.recipeIngrediants.split(',');
        // [
        //     {ingredientName: "potatose",quantity: "200gr"},
        //     {ingredientName: "tomatoes",quantity: "2 pieces"},
        //     {ingredientName: "olive oil",quantity: "20cl"}
        // ];
        const recipeToSend = JSON.stringify(recipeINgTest);
        console.log(recipeToSend);
        const config = {headers: {
            Accept:'*/*',
            'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
        }};
        const formData = new FormData();
        formData.append('recipePicture',recipePicture);
        formData.append('recipeName', formRecipe.recipeName);
        formData.append('recipeCategory', formRecipe.recipeCategory);
        // formData.append('recipeDescription', formRecipe.recipeDescription);
        formData.append('recipeDescription', JSON.stringify(convertToRaw(instructions.getCurrentContent())));
        formData.append('recipePreparationTime', formRecipe.recipePreparationTime);
        formData.append('recipeCookingTime', formRecipe.recipeCookingTime);
        formData.append('recipeCreator', recipeCreator);
        formData.append('recipeCreatorName', recipeCreatorName);
        formData.append('recipeIngrediants', recipeToSend);
        // console.log('myPictureIs', recipePicture);
        // console.log(JSON.stringify(formRecipe));
        // axios.post('http://localhost:8080/recipes/add-recipe', formData, config
        // )
        dispatch(createRecipe(formData, config)).then(setModal(showModale)).then(()=>setTimeout(() => {
            history.push(`/recipes`);
            setModal(false);
        }, 4000));
        
            
    }
    useEffect(()=>{
        localStorage.getItem('myUser');
        localStorage.getItem('userToken');
    }, [])
    
    if(user){
        return (
            <div className="formNewRecipe">
                <Form className="m-4 col-10 m-auto" encType="multipart/form-data" onSubmit={handleSubmit }>
                    <FormGroup className="col-5 m-auto">
                        <Label for="recipeName">Name of the recipe</Label>
                        <Input type="text" name="recipeName" id="recipeName" placeholder="Enter a name for your recipe" onChange={handleChange} />
                    </FormGroup>
                    {formRecipe.errors.recipeNameError?
                        <div style={{color:'red'}}>
                            {formRecipe.errors.recipeNameError}
                        </div>: null
                    }
                    <FormGroup className="col-5 m-auto">
                        <Label for="recipeCategory">Select a category</Label>
                        <Input type="select" name="recipeCategory" id="recipeCategory" placeholder="Choice a category" onChange={handleChange}>
                            <option value="">Choice...</option>
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
                    {/* <FormGroup>
                        <Label for="recipeCategory">Category</Label>
                        <Input type="text" name="recipeCategory" id="recipeCategory" placeholder="Choice a category" onChange={handleChange} />
                    </FormGroup> */}
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
                            <h4>Appercu des ing</h4>
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
                    
                    {/* <FormGroup>
                        <Label for="recipeDescription">Instructions of the recipe</Label>
                        <Input type="textarea" name="recipeDescription" id="recipeDescription" placeholder="Instructions of the recipe" onChange={handleChange} />
                    </FormGroup> */}
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
                        <Input type="text" name="recipePreparationTime" id="recipePreparationTime" placeholder="Enter preparation time duration (in minutes)"  onChange={handleChange}/>
                    </FormGroup>
                    <FormGroup className="col-6 d-inline-block">
                        <Label for="recipeCookingTime">Time of cooking</Label>
                        <Input type="text" name="recipeCookingTime" id="recipeCookingTime" placeholder="Enter cooking time duration (in minutes)"  onChange={handleChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="recipePicture">Image of the recipe</Label>
                        <Input type="file" name="recipePicture" id="recipePicture" placeholder="Select a picture" onChange={selectImage}/>
                    </FormGroup>
                    <Button type="submit" color="primary" style={{margin:5}}>
                        Add this recipe
                    </Button>
                </Form>
                <Modal isOpen={modal} toggle={toggle} scrollable={true} >
                        <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
                        <ModalBody>
                            {/* {modalTitle !== 'Our policy confidential' ?
                            <div className="divImage">
                                <img className="modalImage" src={modalImage} alt="pictur response" />
                            </div>: null   
                            } */}
                            {modalBody}       
                        </ModalBody>
                        <ModalFooter>
                        <Button color="primary"  onClick={toggle}>OK</Button>{' '}
                        {/* {willRedirect ? <Redirect to="/recipes" />
                        : null } */}
                        {/* <Button color="secondary" onClick={toggle}>Cancel</Button> */}
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

export default Recipes;