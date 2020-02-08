import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "./ContactData/ContactData";

// Gathering the info to be passed to the CheckoutSummary component to display the order
const Checkout = props => {
  const checkoutCancelledHandler = () => {
    props.history.goBack();
  };

  const checkoutContinuedHandler = () => {
    props.history.replace("/checkout/contact-data");
  };

  let summary = <Redirect to="/" />;

  // at the first loading the ingredients can be null till they are fetched from the backend
  // so the user is redirected if this is the case
  // an alternative can be to show the spinner
  if (props.ings) {
    //redirecting after the purchase is complete
    const purchasedRedirect = props.purchsed ? <Redirect to="/" /> : null;
    summary = (
      <div>
        {purchasedRedirect}
        <CheckoutSummary
          ingredients={props.ings}
          checkoutCancelled={checkoutCancelledHandler}
          checkoutContinued={checkoutContinuedHandler}
        />
        <Route
          path={props.match.url + "/contact-data"}
          component={ContactData}
        />
      </div>
    );
  }
  return summary;
};

// getting the state from the redux store
const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    purchsed: state.order.purchased
  };
};

//connecting the component and the redux store
export default connect(mapStateToProps)(Checkout);
