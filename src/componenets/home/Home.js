import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {getProfessionnals} from "../../redux/actions/UserActions";
import {Link} from "react-router-dom";
import axios from "axios";
import {Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption, UncontrolledCarousel } from 'reactstrap';
import "./home.css";


const Home = ()=>{

    const [lastRecipes, setLastRecipes] = useState([]);
    const dispatch = useDispatch();
    const allProf = useSelector(state=>state.userReducer.professionnals)
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
            <img id="carouselImg" src={`http://localhost:8080${item.recipePicture}`} alt={item.recipeName} />
            <Link to={{pathname: `/recipesDetails/${item._id}`, state:{item}}}>
                <CarouselCaption captionText={item.recipeName} captionHeader={item.recipeName} />  
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
        <div className="homePage">
            <Carousel className="homeCarousel"
            activeIndex={activeIndex}
            next={next}
            previous={previous}
            >
            <CarouselIndicators items={lastRecipes} activeIndex={activeIndex} onClickHandler={goToIndex} />
                {slides}
            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
            <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
        </Carousel>
        </div>
        // <UncontrolledCarousel items={lastRecipes} />
        
        // <div>
        //     <h1>THIS IS HOME PAGE TEST FOR OMARMERN APP</h1>
        //     <div>
        //         {lastRecipes && lastRecipes.map((recipe, index)=>(
        //             <div key={index}>
        //                 <p>{recipe.recipeName}</p>
        //             </div>
        //         ))}
        //     </div>
        // </div>
        
    )
}

export default Home;