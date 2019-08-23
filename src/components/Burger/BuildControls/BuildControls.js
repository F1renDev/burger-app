import React from "react";
import styles from "./BuildControls.module.css";
import BuildControl from "./BuildControl/BuildControl";

const controls = [
  { label: "Salad", type: "salad" },
  { label: "Bacon", type: "bacon" },
  { label: "Cheese", type: "cheese" },
  { label: "Meat", type: "meat" }
];

// rendering a list of BuildControl components based on the quantity of ingredients
const buildControls = (props) => (
  <div className={styles.buildControls}>
    <p>
      Current price: <strong>{props.price.toFixed(2)}</strong>
    </p>
    {controls.map((item) => {
      return (
        <BuildControl
          key={item.label}
          label={item.label}
          removed={() => props.ingredientRemoved(item.type)}
          added={() => props.ingredientAdded(item.type)}
          disabled={props.disabled[item.type]}
        />
      );
    })}
    <button
      className={styles.orderButton}
      onClick={props.ordered}
      disabled={!props.purchasable}>
      ORDER NOW
    </button>
  </div>
);

export default buildControls;
