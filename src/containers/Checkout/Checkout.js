import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "./ContactData/ContactData";
import * as actions from "../../store/actions/index";

// Gathering the info to be passed to the CheckoutSummary component to display the order
class Checkout extends React.Component {

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  };

  checkoutContinuedHandler = () => {
    this.props.history.replace("/checkout/contact-data");
  };

  render() {
    let summary = <Redirect to='/' />;
    
    // at the first loading the ingredients can be null till they are fetched from the backend
    // so the user is redirected if this is the case
    // an alternative can be to show the spinner
    if (this.props.ings) {
      //redirecting after the purchase is complete
    const purchasedRedirect = this.props.purchsed ? <Redirect to="/" /> : null;
      summary = (
        <div>
          {purchasedRedirect}
          <CheckoutSummary
            ingredients={this.props.ings}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
          />
          <Route
            path={this.props.match.url + "/contact-data"}
            component={ContactData}
          />
        </div>
      );
    }
    return summary;
  }
}

// getting the state from the redux store
const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    purchsed: state.order.purchased
  };
};



//connecting the component and the redux store
export default connect(mapStateToProps)(Checkout);
