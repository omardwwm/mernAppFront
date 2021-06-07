import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardText, CardBody, CardLink, CardTitle, CardSubtitle, Button } from "reactstrap";
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
        <div className="chefsDiv p-2" >
            <h2>Nos chefs</h2>
            {allProfessionals && allProfessionals.map((chef, index)=>{
                return (
                    <div className="chefDiv row"  key={index} >
                            <Card className="row chefCrad col-2 d-block" >
                                <CardTitle>{chef.username}</CardTitle>
                                <img className="img-fluid chefPic"
                                    // src={`https://mern-recipes.herokuapp.com${chef.profilePicture}`}
                                    src={chef.profilePicture}
                                    alt="picture-profile-chef"
                                    />
                            </Card>
                        <div className="col-10 chefRealisations " >
                            {/* <div>
                                <h4 id="titreRealisation">Ses realisations</h4>
                            </div> */}
                            <div className="d-flex" >
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
                                                    <Card id="existingRecipes" >
                                                        <CardTitle id="titleCardRealisation">{recipe.recipeName}</CardTitle>
                                                        <img src={recipe.recipePicture} className="recipeChefPic" alt="illustration-recipe" />
                                                        <CardSubtitle>cat: {recipe.recipeCategory}</CardSubtitle>
                                                        <Link to={{pathname: `/recipesDetails/${recipe._id}`, state:{recipe}}}>Plus de detail</Link>
                                                    </Card>   
                                                </div>                  
                                            )
                                        })}
                                    </>
                                    )                       
                                }
                            </div>                               
                        </div>                       
                    </div>
                )
            })}
        </div>
    )
}

export default Chefs;