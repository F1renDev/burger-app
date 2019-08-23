import React from "react";
import Burger from "../../Burger/Burger";
import Button from "../../UI/Button/Button";
import styles from "./CheckoutSummary.module.css";

// Displaying a checkout info on a separete page with ability to cancel or to continue
const checkoutSummary = (props) => {
  return (
    <div className={styles.checkoutSummary}>
      <h1>Hope it tastes well!</h1>
      <div style={{ width: "100%", margin: "auto" }}>
        <Burger ingredients={props.ingredients} />
      </div>
      <Button btnType="danger" clicked={props.checkoutCancelled}>
        CANCEL
      </Button>
      <Button btnType="success" clicked={props.checkoutContinued}>
        CONTINUE
      </Button>
    </div>
  );
};

export default checkoutSummary;
