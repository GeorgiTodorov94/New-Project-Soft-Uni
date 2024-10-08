import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetOneRecipes } from "../../hooks/useRecipes";
import { useAuthContext } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import '../../static/CSS/recipe.css';
import recipesAPI from "../../api/recipes-Api";
import { nanoid } from 'nanoid'
import MealPlannerService, { baseURL } from "../../api/myRecipesService";

export default function RecipeDetails() {
    const baseUrl = ``
    const navigate = useNavigate();
    const { userId, isAuthenticated } = useAuthContext();
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useGetOneRecipes(recipeId);
    const isOwner = userId === recipe._ownerId;
    const [currentRecipe, setCurrentRecipe] = useState(null);
    const [mealAddedToPlanner, setMealAddedToPlanner] = useState(null);
    useEffect(() => {
        (async () => {
            const currentRecipe = await recipesAPI.getOne(recipeId);
            setCurrentRecipe(currentRecipe);
            console.log(currentRecipe)
        })();
    }, []);

    const recipeDeleteHandler = async () => {
        try {
            await recipesAPI.remove(recipeId)
            navigate('/recipes')

        } catch (error) {
            console.log(error.message)
        }
    };

    const handleAdding = () => {
        MealPlannerService.create(currentRecipe, userId);
        console.log(userId);
        console.log(currentRecipe._id);
        console.log(currentRecipe);
        navigate(`/recipes/${recipeId}/details`)
        setMealAddedToPlanner(<button> Recipe added to Planner</button>)
    };
    console.log(recipe)

    return (
        <div className="recipe">
            <h1><img className="arrow"
                onClick={() => { navigate(-1) }}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Back_Arrow.svg/768px-Back_Arrow.svg.png" width="35px"
            /> {recipe.name}</h1>

            <div className="core-recipe-details">
                <img className="recipe-avatar" src={recipe.imageUrl} />
            </div>
            <div className="ingredients">
                Ingredients: {/** To do the CSS here. */}
                {
                    recipe.ingredients.map((item, index) => (
                        <p className="ingredient-text" key={recipe._id}>
                            {Object.entries(item).map(([key, value]) => {
                                return (
                                    <span> <strong> {`${value}`}</strong></span>
                                );
                            })}
                        </p>
                    ))
                }
            </div>
            <div width="70%">
                <p className="info-p"><b>Method: </b> {recipe.method}</p>
                <p className="info-p"><b>Notes: </b>{recipe.notes}</p>
                <p className="info-p"><b>Category: </b>{recipe.category} </p>
                <p className="info-p"><b>Dietary: </b>{recipe.dietary} </p>
                <p className="info-p"><b>Recommended Servings: </b>{recipe.servings} </p>
            </div>

            {isOwner && (
                <div className="buttons">
                    <Link to={`/recipes`} onClick={recipeDeleteHandler} className="button">Delete Recipe</Link>
                    <Link to={`/recipes/${recipeId}/edit`} className="button">Update Recipe</Link>
                </div>
            )}
            {!!isAuthenticated && (
                <div className="buttons">
                    <Link onClick={() => handleAdding()} className="button">Add Recipe to Meal Plan</Link>
                </div>
            )}

        </div>
    )
}