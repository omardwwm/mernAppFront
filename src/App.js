import React from "react";
import './App.css';
// import logo from './logo.svg';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "../src/redux";
import Home from "../src/componenets/home/Home";
import Auth from "../src/componenets/login/Auth";
import Signup from "../src/componenets/signup/Signup";
import newRecipes from "./componenets/recipes/newRecipes";
import Recipes from "./componenets/recipes/recipes";
import RecipeDetails from "./componenets/recipes/recipeDetails";
import updateRecipe from "./componenets/recipes/UpdateRecipe";
import Profile from "./componenets/profile/Profile";
import Chefs from "./componenets/chefs/Chefs";
import ForgotPassword from "./componenets/login/ForgotPaasword";
import ResetPassword from "./componenets/login/ResetPassword"
import NavBar, {} from "../src/componenets/navBar/navBar";


function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <BrowserRouter>
        <NavBar/>
          <Switch>
            <Route exact path ="/" component={Home}/>
            <Route exact path = "/login" component={Auth} />
            <Route exact path = "/forgot-password" component={ForgotPassword} />
            <Route exact path = "/reset-password/:id/:token" component={ResetPassword} />
            <Route exact path="/profile/:id" component={Profile} />
            <Route exact path="/create-account" component={Signup} />
            <Route exact path="/create-recipes" component={newRecipes} />
            <Route exact path="/updateRecipe/:id" component={updateRecipe} />
            <Route exact path="/recipes" component={Recipes} />
            <Route exact path="/chefs" component={Chefs} />
            <Route exact path="/recipesDetails/:_id" component={RecipeDetails} />
          </Switch>
        </BrowserRouter>
      </div>
    </Provider>
   
  );
}

export default App;
