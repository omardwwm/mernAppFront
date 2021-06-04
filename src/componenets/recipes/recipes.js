import React, { useEffect, useState, useCallback, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import {getAllRecipes} from "../../redux";
import {Link} from "react-router-dom";
import axios from "axios";
import { Form, FormGroup, Label, Input} from 'reactstrap';
import {GiCakeSlice, GiHotMeal, GiMeal} from 'react-icons/gi';
import {SiCodechef} from 'react-icons/si';
import "./recipes.css";

const Recipes =(props)=>{
    const dispatch = useDispatch();
    const [recipes, setRecipes] =useState([]);
    // const [currentPath, setCurrentPath] = useState(window.location.pathname);
    // const [recipes, setRecipes] = useState(useSelector(state=>state.recipeReducer.recipes));
    // const user = useSelector(state=>state.userReducer.user);
    const user = JSON.parse(localStorage.getItem('myUser'));
    // console.log(user)
    console.log('insideReact', recipes);
    const firstUpdate = useRef(true);
    const myCategories2 = [{category: "entree", icon:<GiMeal style={{color:'rgb(27, 214, 58)'}}/>}, {category: "plat", icon:<GiHotMeal style={{color:'rgb(224, 218, 38)'}}/>}, {category: "dessert", icon:<GiCakeSlice style={{color:'rgb(216, 62, 126)'}}/>}];
    const myCategories = [
        {"_id":1, "name": "entree"}, {"_id":2, "name": "plat"}, {"_id":3, "name": "dessert"}
    ]
    const [categories, setCategories] = useState([]);
    const [filtredCategories, setFiltredCategories] = useState([]);

    const newRecipes = [...recipes];
    const newCategories = [...categories];

    const onCheckCategory =(myCategory)=>{
        // console.log(filtredCategories);
     
        const currentIndex = categories.indexOf(myCategory);
        // console.log(currentIndex);
        // event.target.checked ? setCategories([...newCategories, event.target.name]) : 
        // setCategories([newCategories.filter(item => item !== event.target.value)])
        if(currentIndex === -1){
            // if(event.target.checked){
            // let addedCategory = event.target.value
            // setCategories([...newCategories, addedCategory])
            newCategories.push(myCategory);
            // console.log('categories are::', categories);
        }else{
            // setCategories([newCategories.filter(item => item !== event.target.value)]);
            newCategories.splice(currentIndex, 1)
            // console.log('categories are::', categories);
        }
        setCategories(newCategories);
        // console.log('categories are::', categories);
    };

    useEffect(()=>{
        if(categories.length === 0){
            setFiltredCategories([...newRecipes])
        }else{
            setFiltredCategories(
                newRecipes.filter(categorie =>
                    categories.some(category => [categorie.recipeCategory].flat().includes(category))
                    )
            )
        };
    }, [categories]) 

    // console.log('filtredCategories are:', filtredCategories);
    // console.log('categories are::', categories);
   
    const checkboxList =()=>
    myCategories.map((myCategory, index)=>(
            <div className="d-inline-block" key={index}>
                    <label >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;               
                        <input  
                            type="checkbox" 
                            value={myCategory.category} 
                            // checked={myCategory.isChecked} 
                            checked={categories.indexOf(myCategory.name) === -1 ? false : true}
                            onChange={()=>onCheckCategory(myCategory.name)}
                            name={myCategory.name}
                        />&nbsp;  
                        {/* {myCategory.icon} */}
                        {myCategory.name}
                    </label>
            </div>
        ))     
    const fetchRecipes =async()=>{
        await axios.get('https://mern-recipes.herokuapp.com/recipes').then(response=>{
            setRecipes([...recipes, ...response.data]);
            setFiltredCategories([...filtredCategories, ...response.data]) 
        })      
    } 
    // console.log(recipes);
    useEffect(()=>{
        // const { pathname } = window.location;
        fetchRecipes();
        setCategories(newCategories);
        checkboxList();
        // setCurrentPath(pathname);
        // console.log(window.location)
        // if(categories.length === 0){
        //     setFiltredCategories(recipes)
        //     console.log(filtredCategories);
        //     console.log(categories);
        // }else{
        //     setFiltredCategories(
        //         recipes.filter(categorie =>
        //             categories.some(category => [categorie.recipeCategory].flat().includes(category))
        //             )
        //     )
        //     console.log(filtredCategories);
        //     console.log(categories);
        // };
    }
    ,[]); 

    if(!recipes){
        return <p>Looding ...</p>
    }else if(recipes.length === 0){ 
        return <p>Pas de recettes pour le moment</p>
    }else
    return (
        <div className="recipes">
            <h1 >All our recipes</h1>
            <Form>
            {checkboxList()}
            </Form>
            <div>
                {recipes && filtredCategories.map((recipe, index) =>{ 
                    return (
                        <div key={index} className="d-inline-block m-3 wrap ">
                            <p>{recipe.recipeName}</p>
                            <img src={`https://mern-recipes.herokuapp.com${recipe.recipePicture}`} style={{width:'300px', height:'200px', borderRadius:10}} alt="recipe illustration" />
                            {recipe.recipeCreator && recipe.recipeCreator._id ===user && user.id || recipe.recipeCreator && recipe.recipeCreator._id ===user && user._id ? 
                            <p>By: Me</p> 
                            : <p>By: {recipe.recipeCreatorName}</p>}
                            {recipe.recipeCreator && recipe.recipeCreator.isPro == true? <SiCodechef style={{color:'#fff', fontSize:24}}/>: null}
                            <Link to={{pathname: `/recipesDetails/${recipe._id}`, state:{recipe}}} >See more..</Link>
                        </div>
                    )
                })}
            </div>
        </div>
        
    )
}

export default Recipes;