import { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";

export const Home = () => {
  const [recipe, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3001/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipe = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:3001/recipes/savedRecipes/ids/${userID}`
        );
        if (response.data.savedRecipes) {
          setSavedRecipes(response.data.savedRecipes);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipe();
    fetchSavedRecipe();
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      console.log(recipe);
      const response = await axios.put(
        "http://127.0.0.1:3001/recipes",
        {
          recipeID,
          userID,
        },
        { headers: { Authorization: cookies.access_token } }
      );

      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipe.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2> Name: {recipe.title}</h2>
              <button
                className={`button ${isRecipeSaved(recipe._id) ? "saved" : ""}`}
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="description">
              <p>ingredients: {recipe.ingredients}</p>
              <p>Description: {recipe.description}</p>
              <p>Cooking Time: {recipe.cookingTime} minutes</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
          </li>
        ))}
      </ul>
    </div>
  );
};
