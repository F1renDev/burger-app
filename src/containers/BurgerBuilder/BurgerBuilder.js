import React, { useState, useEffect } from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

const BurgerBuilder = props => {
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    props.onInitIngredients();
  }, []);

  // if there are no ingredients added, 'false' is returned and passed further to disable
  // the order button
  const updatePurchaseState = ingredients => {
    const sum = Object.keys(ingredients)
      .map(item => {
        return ingredients[item];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

    return sum > 0;
  };

  // executed after 'Order now' was clicked
  const purchaseHandler = () => {
    if (props.isAuthenticated) {
      setPurchasing(true);
    } else {
      props.onSetAuthRedirectPath("/checkout");
      props.history.push("/auth");
    }
  };

  // executed to remove the backdrop and the modal with the order summary
  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  // Going to the Checkout component after the "Continue" button in the modal was clicked
  const purchaseContinueHandler = () => {
    props.onInitPurchase();
    // Passing the ingredients for the burger on the checkout page with a GET request
    props.history.push("/checkout");
  };

  const disabledInfo = {
    ...props.ings
  };
  // disabledInfo[key] is either true or false ( {salad: true, meat: false, ...} )
  // eslint-disable-next-line no-unused-vars
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }

  // The spinner is shown till we get back a response from the POST request
  // made in purchaseContinueHandler()
  //
  // orderSummary is waiting for data to be fetched from the Firebase
  let orderSummary = null;

  /* Spinner is shown before the ingredients are retrieved from the Firebase into the state.ingredients */
  /* And a message is shown if they could not be retrieved */
  let burger = props.error ? (
    <p style={{ textAlign: "center" }}>Ingredients can't be loaded</p>
  ) : (
    <Spinner />
  );
  if (props.ings) {
    burger = (
      <React.Fragment>
        <Burger ingredients={props.ings} />
        <BuildControls
          price={props.price}
          ingredientRemoved={props.onIngredientRemoved}
          ingredientAdded={props.onIngredientAdded}
          disabled={disabledInfo}
          ordered={purchaseHandler}
          purchasable={updatePurchaseState(props.ings)}
          isAuth={props.isAuthenticated}
        />
      </React.Fragment>
    );
    orderSummary = (
      <OrderSummary
        price={props.price.toFixed(2)}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
        ingredients={props.ings}
      />
    );
  }

  return (
    <React.Fragment>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </React.Fragment>
  );
};

// getting the state from the redux store
const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  };
};

// mapping the dispatched actions to props
const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingName => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: ingName => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngridients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path))
  };
};

//connecting the component and the redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
