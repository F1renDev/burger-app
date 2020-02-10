import React from "react";

import styles from "./Order.module.css";

// Component to display a single burger order
const order = props => {
  const ingredients = [];

  // eslint-disable-next-line no-unused-vars
  for (let ingredientItem in props.ingredients) {
    ingredients.push({
      name: ingredientItem,
      amount: props.ingredients[ingredientItem]
    });
  }

  const preparedIngredients = ingredients.map(item => {
    return (
      <span
        style={{
          textTransform: "capitalize",
          display: "inline-block",
          margin: "0 8px",
          border: "1px solid #ccc",
          padding: "5px"
        }}
        key={item.name}
      >
        {item.name} ({item.amount})
      </span>
    );
  });

  return (
    <div className={styles.order}>
      <p>Ingredients: {preparedIngredients}</p>
      <p>
        Price: <strong>{props.price}</strong>
      </p>
    </div>
  );
};

export default order;
