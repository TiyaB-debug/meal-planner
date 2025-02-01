import React, { useState, useEffect } from 'react';
import '../styles/MealPlanner.css'; // Import the CSS file
import RecipeList from './RecipeList';
import { recipes } from '../utils/data'; // Correct path to data.js

function MealPlanner() {
  const [mealRecipes, setMealRecipes] = useState([]);

  useEffect(() => {
    setMealRecipes(recipes); // Fetch or use static data
  }, []);

  return (
    <div className="meal-planner">
      <h2>Suggested Recipes</h2>
      <RecipeList recipes={mealRecipes} />
    </div>
  );
}

export default MealPlanner;
