import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardText, CardBody, CardLink, CardTitle, CardSubtitle, Button, Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from "reactstrap";
import {getProfessionnals} from "../../redux/actions/UserActions";
import "./chefs.css";



const Chefs = ()=>{

    const token = localStorage.getItem('userToken');
    const config = {headers: {
        'Authorisation': `Bearer ${token}`,
        "x-auth-token":`${token}`
    }};

    const dispatch = useDispatch();
    const allProfessionals = useSelector(state=>state.userReducer.professionnals);
    console.log(allProfessionals);

   useEffect(()=>{
       dispatch(getProfessionnals(config));  
   }, [])

    return (
        <div className=" chefsDiv p-2" >
            <h2>Nos chefs</h2>
            {allProfessionals && allProfessionals.map((chef, index)=>{
                return (
                    <div className="chefDiv "  key={index} >
                        <div className= "chefCrad col-3">
                            <Card id="chefCard" className="row" >
                                <CardTitle>{chef.username}</CardTitle>
                                <img className="img-fluid chefPic" src={`https://mern-recipes.herokuapp.com${chef.profilePicture}`} alt="picture-profile-chef" />
                            </Card>
                        </div>
                        <div className="col-9 chefRealisations p-1" >
                            <Card >
                            <h4 id="titreRealisation">Ses realisations</h4>
                                {chef.recipes.length <= 0?(
                                    <>
                                        <Card className="m-1  emptyRecipeCard">
                                            <CardTitle>Ce chef n'a pas encore poste de recettes</CardTitle>
                                        </Card>
                                    </>                               
                                    ):(
                                    <>
                                        { chef.recipes.map((recipe, index)=>{
                                            return (
                                                <div className="recipeCard" key={index}>
                                                    <Card id="existingRecipes"  >
                                                        <CardTitle>{recipe.recipeName}</CardTitle>
                                                        <img src={`https://mern-recipes.herokuapp.com${recipe.recipePicture}`} className="recipeChefPic" alt="illustration-recipe" />
                                                        <CardSubtitle>cat: {recipe.recipeCategory}</CardSubtitle>
                                                        <Link to={{pathname: `/recipesDetails/${recipe._id}`, state:{recipe}}}>Plus de detail</Link>
                                                    </Card>   
                                                </div>                  
                                            )
                                        })}
                                    </>
                                    )                       
                                }
                            </Card>                               
                        </div>                       
                    </div>
                )
            })}
        </div>
    )
}

export default Chefs;