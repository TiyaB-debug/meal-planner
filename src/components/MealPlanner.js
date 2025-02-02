import React, { useState } from 'react';
import axios from 'axios';
import '../styles/MealPlanner.css'; // Assuming styles are in this file

const MealPlanner = () => {
  const [mealData, setMealData] = useState([]);
  const [diet, setDiet] = useState('');
  const [allergy, setAllergy] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState({});
  const [expandedRecipe, setExpandedRecipe] = useState(null); // Track expanded recipe

  const SPOONACULAR_API_KEY = '74f8c3d8b566423cbd34749974ddc3bb'; // Replace with your API key

  const fetchMeals = async () => {
    setLoading(true);
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${ingredients}&diet=${diet}&intolerances=${allergy}&number=10`;

    try {
      const response = await axios.get(url);
      const mealIds = response.data.results.map(meal => meal.id);

      const recipePromises = mealIds.map(id =>
        axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`)
      );

      const recipeResponses = await Promise.all(recipePromises);
      const recipes = recipeResponses.reduce((acc, res) => {
        acc[res.data.id] = res.data; 
        return acc;
      }, {});

      setMealData(response.data.results);
      setRecipeDetails(recipes);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="meal-planner">
      <h1 className="title">Healthy Eating, Made Simple.</h1>

      <div className="input-group">
        <label>
          Ingredients:
          <input 
            type="text" 
            value={ingredients} 
            onChange={(e) => setIngredients(e.target.value)} 
            placeholder="Enter ingredients (e.g., chicken, tomato)" 
          />
        </label>
      </div>

      <div className="input-group">
        <label>
          Diet Preference:
          <select onChange={(e) => setDiet(e.target.value)} value={diet}>
            <option value="">Select Diet</option>
            <option value="balanced">Balanced</option>
            <option value="high-protein">High-Protein</option>
            <option value="low-carb">Low-Carb</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
          </select>
        </label>
      </div>

      <div className="input-group">
        <label>
          Allergy or Health Concerns:
          <select onChange={(e) => setAllergy(e.target.value)} value={allergy}>
            <option value="">Select Allergy</option>
            <option value="peanut">Peanut</option>
            <option value="gluten">Gluten</option>
            <option value="dairy">Dairy</option>
            <option value="soy">Soy</option>
            <option value="egg">Egg</option>
          </select>
        </label>
      </div>

      <button className="btn" onClick={fetchMeals} disabled={loading}>
        {loading ? 'Loading...' : 'Find Meals'}
      </button>

      <div className="recipe-list">
        {mealData.length > 0 ? (
          mealData.map((meal) => (
            <div key={meal.id} className="recipe-card">
              <div className="meal-image">
                <img src={meal.image} alt={meal.title} />
              </div>
              <div className="meal-info">
                <h3>{meal.title}</h3>

                {/* Button to toggle recipe details */}
                <button 
                  className="view-recipe-btn"
                  onClick={() => setExpandedRecipe(expandedRecipe === meal.id ? null : meal.id)}
                >
                  {expandedRecipe === meal.id ? "Hide Recipe" : "View Recipe"}
                </button>

                {/* Displaying full recipe details if expanded */}
                {expandedRecipe === meal.id && recipeDetails[meal.id] && (
                  <div className="recipe-details">
                    <div className="ingredients">
                      <h4>Ingredients:</h4>
                      <ul>
                        {recipeDetails[meal.id].extendedIngredients.map((ingredient, i) => (
                          <li key={i}>{ingredient.name}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="instructions">
                      <h4>Instructions:</h4>
                      <div dangerouslySetInnerHTML={{ __html: recipeDetails[meal.id].instructions }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No meals found.</p>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
