import React from 'react';
import '../styles/RecipeCard.css';

function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.name} className="recipe-image" />
      <div className="recipe-info">
        <h3>{recipe.name}</h3>
        <p><strong>Meal Type:</strong> {recipe.mealType}</p>
        <h4>Ingredients:</h4>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <h4>Instructions:</h4>
        <p>{recipe.instructions}</p>
      </div>
    </div>
  );
}

export default RecipeCard;
