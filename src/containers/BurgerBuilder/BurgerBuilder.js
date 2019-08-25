import React from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";

class BurgerBuilder extends React.Component {
  state = {
    purchasing: false,
    loading: false,
    error: false
  };

  // Getting the ingredients dynamically from the Firebase when the BurgerBuilder is mounted
  componentDidMount() {
    console.log(this.props);
    // axios
    //   .get("https://burger-app-35129.firebaseio.com/ingredients.json")
    //   .then((response) => {
    //     this.setState({
    //       ingredients: response.data
    //     });
    //   })
    //   .catch((error) => {
    //     this.setState({
    //       error: true
    //     });
    //   });
  }

  // if there are no ingredients added, 'false' is returned and passed further to disable
  // the order button
  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((item) => {
        return ingredients[item];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

    return sum > 0;
  };

  // executed after 'Order now' was clicked
  purchaseHandler = () => {
    this.setState({
      purchasing: true
    });
  };

  // executed to remove the backdrop and the modal with the order summary
  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false
    });
  };

  // Going to the Checkout component after the "Continue" button in the modal was clicked
  purchaseContinueHandler = () => {
    // Passing the ingredients for the burger on the checkout page with a GET request
    this.props.history.push("/checkout");
  };

  render() {
    const disabledInfo = {
      ...this.props.ings
    };
    // disabledInfo[key] is either true or false ( {salad: true, meat: false, ...} )
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
    let burger = this.state.error ? (
      <p style={{ textAlign: "center" }}>Ingredients can't be loaded</p>
    ) : (
      <Spinner />
    );
    if (this.props.ings) {
      burger = (
        <React.Fragment>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            price={this.props.price}
            ingredientRemoved={this.props.onIngredientRemoved}
            ingredientAdded={this.props.onIngredientAdded}
            disabled={disabledInfo}
            ordered={this.purchaseHandler}
            purchasable={this.updatePurchaseState(this.props.ings)}
          />
        </React.Fragment>
      );
      orderSummary = (
        <OrderSummary
          price={this.props.price.toFixed(2)}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          ingredients={this.props.ings}
        />
      );
    }
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <React.Fragment>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.ingredients,
    price: state.totalPrice
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) =>
      dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
    onIngredientRemoved: (ingName) =>
      dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
