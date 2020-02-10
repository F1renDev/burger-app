import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-orders";

// action creators to be dispatched in the components
export const addIngredient = name => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: name
  };
};

export const removeIngredient = name => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName: name
  };
};

// !-------------------------------
// This is a synchronous action creator. This is an action that will eventually be dispatched
// when the async code in the initIngredients() function is done.
export const setIngredients = ingredients => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients: ingredients
  };
};

// this action will be dispatched if the ingredient loading process have failed
export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED
  };
};

export const initIngridients = () => {
  // Getting the ingredients dynamically from the Firebase when the BurgerBuilder is mounted
  return dispatch => {
    axios
      .get("https://burger-app-35129.firebaseio.com/ingredients.json")
      .then(response => {
        dispatch(setIngredients(response.data));
      })
      .catch(error => {
        dispatch(fetchIngredientsFailed());
      });
  };
};
// !--------------------------------
