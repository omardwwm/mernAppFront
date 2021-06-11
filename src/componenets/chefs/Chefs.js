import React, { useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardTitle, CardSubtitle, Image} from "reactstrap";
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
    // console.log(allProfessionals);

   useEffect(()=>{
       dispatch(getProfessionnals(config));  
   }, [])

    return (
        <div className="chefsDiv " >
            <h2>Nos chefs</h2>
            {allProfessionals && allProfessionals.map((chef, index)=>{
                return (
                    <div className="chefDiv row mr-0 ml-0"  key={index} >
                            <Card className="row chefCrad col-2 d-block" >
                                <CardTitle>{chef.username}</CardTitle>
                                <img className="img-fluid chefPic"
                                    // src={`https://mern-recipes.herokuapp.com${chef.profilePicture}`}
                                    src={chef.profilePicture}
                                    alt="illustration-profile-chef"
                                    />
                            </Card>
                        <div className="col-10 " >
                            {chef.recipes.length <= 0?(
                                <>
                                    <Card className="m-1  emptyRecipeCard">
                                        <CardTitle>Ce chef n'a pas encore poste de recettes</CardTitle>
                                    </Card>
                                </>                               
                                ):(
                                <div className="chefRealisations ">
                                    { chef.recipes.map((recipe, index)=>{
                                        return (
                                            <div  key={index}>
                                                <div className="recipeCard">
                                                    <Card >
                                                        <CardTitle id="titleCardRealisation">{recipe.recipeName}</CardTitle>
                                                        <Link to={{pathname: `/recipesDetails/${recipe._id}`, state:{recipe}}}>
                                                            <img src={recipe.recipePicture} className="recipeChefPic" alt="illustration-recipe" />
                                                            <CardSubtitle>cat: {recipe.recipeCategory}</CardSubtitle>
                                                        </Link>
                                                    </Card>   
                                                </div>       
                                            </div>                  
                                        )
                                    })}
                                </div>
                                )                       
                            }
                        </div>                       
                    </div>
                )
            })}
        </div>
    )
}

export default Chefs;