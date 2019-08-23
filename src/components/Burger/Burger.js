import React from "react";
import styles from "./Burger.module.css";
import BurgerIngredient from "./BurgerIngredient/BurgerIngredient";

const burger = (props) => {
  // getting the keys from the ingredients object and make an array of them (cheese, meat, etc)
  let transformedIngredients = Object.keys(props.ingredients)
    .map((ingredientItem) => {
      // then make an array ( with help of Array()) where the length of array
      // is a value for a given key in the initial array
      return [...Array(props.ingredients[ingredientItem])].map(
        // mapping over the the newly created array and returning a BurgerIngredient component depending
        // on the length of a created array ( e.g [cheese: 3] returns 3 BurgerIngredient components )
        (item, i) => {
          return (
            <BurgerIngredient key={ingredientItem + i} type={ingredientItem} />
          );
        }
      );
    })
    // if all the ingredients have a value of 0 ( no ingredietns added ) we flatten a transformedIngredients
    // array ( beacase otherwise it will be like this [Array(0), Array(0), Array(0), Array(0)] )
    // so the transformedIngredients.length will be 4 and not 0
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);

  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Start adding ingredients</p>;
  }
  return (
    <div className={styles.burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
};

export default burger;
