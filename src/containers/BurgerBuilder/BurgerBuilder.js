import React from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends React.Component {
  state = {
    ingredients: null,
    totalPrice: 5,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  };

  // Getting the ingredients dynamically from the Firebase when the BurgerBuilder is mounted 
  componentDidMount() {
    axios
      .get("https://burger-app-35129.firebaseio.com/ingredients.json")
      .then((response) => {
        this.setState({
          ingredients: response.data
        });
      })
      .catch((error) => {
        this.setState({
          error: true
        });
      });
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
    this.setState({
      purchasable: sum > 0
    });
  };

  // adding an ingredient to the summary and updating the total price upon a click
  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients
    });
    this.updatePurchaseState(updatedIngredients);
  };

  // removing an ingredient to the summary and updating the total price upon a click
  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients
    });
    this.updatePurchaseState(updatedIngredients);
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
    const queryParams = [];
    for (let i in this.state.ingredients) {
      queryParams.push(
        encodeURIComponent(i) +
          "=" +
          encodeURIComponent(this.state.ingredients[i])
      );
    }
    queryParams.push("price=" + this.state.totalPrice);
    const queryString = queryParams.join("&");
    this.props.history.push({
      pathname: "/checkout",
      search: "?" + queryString
    });
  };

  render() {
    const disabledInfo = {
      ...this.state.ingredients
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
    if (this.state.ingredients) {
      burger = (
        <React.Fragment>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            price={this.state.totalPrice}
            ingredientRemoved={this.removeIngredientHandler}
            ingredientAdded={this.addIngredientHandler}
            disabled={disabledInfo}
            ordered={this.purchaseHandler}
            purchasable={this.state.purchasable}
          />
        </React.Fragment>
      );
      orderSummary = (
        <OrderSummary
          price={this.state.totalPrice.toFixed(2)}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          ingredients={this.state.ingredients}
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

export default withErrorHandler(BurgerBuilder, axios);
