import { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID.js";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const CreateRecipe = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [],
    description: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID,
  });
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const navigate = useNavigate();

  const handleIngredientChange = (event, idx) => {
    const { value } = event.target;
    const ingredients = recipe.ingredients;
    ingredients[idx] = value;
    setRecipe({ ...recipe, ingredients: ingredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(recipe);
      await axios.post("http://127.0.0.1:3001/recipes", recipe, { headers: { Authorization: cookies.access_token } });
      alert("Recipe Created!");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="create-recipe">
      <h2> CreateRecipe </h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="title"> Title </label>
        <input type="text" id="title" name="title" onChange={handleChange} />

        <label htmlFor="description"> Description</label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
        ></textarea>

        <label htmlFor="ingredients"> Ingredients</label>
        {recipe.ingredients.map((ingredient, idx) => (
          <input
            key={idx}
            type="text"
            name="ingredients"
            value={ingredient}
            onChange={(event) => handleIngredientChange(event, idx)}
          />
        ))}
        <button onClick={addIngredient} type="button">
          {" "}
          Add Ingredient
        </button>
        <label htmlFor="imageUrl"> Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          onChange={handleChange}
        ></input>

        <label htmlFor="cookingTime"> cooking Time</label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          onChange={handleChange}
        ></input>
        <button type="submit"> Create Recipe</button>
      </form>
    </div>
  );
};
