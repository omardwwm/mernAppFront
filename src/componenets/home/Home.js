import React, {useState, useEffect} from "react";
import { useDispatch} from "react-redux";
import {getProfessionnals} from "../../redux/actions/UserActions";
import {Link} from "react-router-dom";
import axios from "axios";
import {Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from 'reactstrap';
import "./home.css";


const Home = ()=>{

    const [lastRecipes, setLastRecipes] = useState([]);
    const dispatch = useDispatch();
    // const allProf = useSelector(state=>state.userReducer.professionnals)
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === lastRecipes.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }
    const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? lastRecipes.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
    }
    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }
    const slides = lastRecipes && lastRecipes.map((item) => {
        return (
          <CarouselItem
            onExiting={() => setAnimating(true)}
            onExited={() => setAnimating(false)}
            key={item.recipePicture}
          >
            <img id="carouselImg"
                // src={`https://mern-recipes.herokuapp.com${item.recipePicture}`}
                src={item.recipePicture}
                alt={item.recipeName}
            />
            <Link to={{pathname: `/recipesDetails/${item._id}`, state:{item}}}>
                <CarouselCaption className="d-block" captionText={item.recipeName} captionHeader={item.recipeName} />  
            </Link>
          </CarouselItem>
        );
      });

    const fetchLastRecipes =async()=>{
        await axios.get('https://mern-recipes.herokuapp.com/recipes/lastRecipes').then(response=>{
            // console.log(response.data);
            setLastRecipes([...lastRecipes, ...response.data])
            // setLastRecipes([...lastRecipes, ...response.data]);
        })      
    } 
    // console.log(lastRecipes);
    // console.log(allProf); 
    useEffect(()=>{
        fetchLastRecipes();
        dispatch(getProfessionnals());
    }, [])

    return (
        <div className="homePage col ">
            <Carousel className="homeCarousel mt-2"
                activeIndex={activeIndex}
                next={next}
                previous={previous}
                >
                <CarouselIndicators items={lastRecipes} activeIndex={activeIndex} onClickHandler={goToIndex} />
                    {slides}
                <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
            </Carousel>
            <div className="presentationPerso">
                <p>
                    Ce site a été realisé dans le but d'apprendre de nouvelles technologies (MERN). La partie frontend est réalisé avec ReactJs et Redux et elle est déployée sur NETLIFY, la partie backend avec NodeJs en utilisant Express et déployée sur HEROKU, concernant la base données c'est de NOSQL en MongoDB et stockée sur MongoDB Atlas (qui donne 500 M de stockage gratuites) avec le stockage des images grâce au service AWS S3.<br/>Tous les services de déploiment et de stockage sont fournis par les différentes plateformes gratuitement et donc des fois le site reponds pas aussi rapidement qu'un site assuré par les formules payantes.<br/>
                    Le site permet de:<br/>  
                </p>
                <ul>
                    <li>
                         Créer un compte, se connecter, déconnecter, modifier certaines informtions (utilisation du JWT pour sécuriser l'authentification et les requêtes vers l'API (backend)) et de supprimer son compte.
                    </li>
                    <li>
                        Créer sa propre recette via un formulaire et un éditeur de texte integré (WYSIWYG) pour les étapes des instructions, on peut également modifier tous les champs de la recette qu'on a posté si on souhaite et de la supprimer.
                    </li>
                    <li>
                        Poster des commentaires pour toutes les recettes et de supprimer ces commentaires aussi.
                    </li>
                </ul>
                <p>
                    D'autres améliorations et fonctionalitées seront ajoutées.
                </p>
            </div>
        </div>
    )
}

export default Home;