import React from "react";
import styles from "./Burger.module.css";
import BurgerIngredient from "./BurgerIngredient/BurgerIngredient";

const burger = (props) => {
    let transformedIngredients = Object.keys(props.ingredients)
        .map((ingredientItem) => {
            return [...Array(props.ingredients[ingredientItem])].map(
                (item, i) => {
                    return (
                        <BurgerIngredient
                            key={ingredientItem + i}
                            type={ingredientItem}
                        />
                    );
                }
            );
        })
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
