import React, { useState } from 'react';
import axios from 'axios';
import '../styles/MealPlanner.css'; // Assuming you have specific styles for MealPlanner

const MealPlanner = () => {
  const [mealData, setMealData] = useState([]);
  const [diet, setDiet] = useState('');
  const [allergy, setAllergy] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState({});

  const SPOONACULAR_API_KEY = 'be8be7ce3035461f9a30df2287b7b355'; // Replace with your Spoonacular API Key

  // Fetch data from Spoonacular API
  const fetchMeals = async () => {
    setLoading(true);
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${ingredients}&diet=${diet}&intolerances=${allergy}&number=10`;

    try {
      const response = await axios.get(url);
      const mealIds = response.data.results.map(meal => meal.id);

      // Now, fetch full recipe details for each meal
      const recipePromises = mealIds.map(id =>
        axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`)
      );

      const recipeResponses = await Promise.all(recipePromises);
      const recipes = recipeResponses.map(res => res.data);

      setMealData(response.data.results);
      setRecipeDetails(recipes); // Store the full recipe details
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="meal-planner">
      <h1 className="title">Healthy Meal Suggestions</h1>

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

      <div className="meal-list">
        {mealData.length > 0 ? (
          <ul>
            {mealData.map((meal, index) => (
              <li key={index} className="meal-card">
                <div className="meal-image">
                  <img src={meal.image} alt={meal.title} />
                </div>
                <div className="meal-info">
                  <h3>{meal.title}</h3>

                  {/* Displaying full recipe details */}
                  {recipeDetails[index] && (
                    <div className="recipe-details">
                      <div className="ingredients">
                        <h4>Ingredients:</h4>
                        <ul>
                          {recipeDetails[index].extendedIngredients.map((ingredient, i) => (
                            <li key={i}>{ingredient.name}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="instructions">
                        <h4>Instructions:</h4>
                        <div dangerouslySetInnerHTML={{ __html: recipeDetails[index].instructions }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No meals found.</p>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
