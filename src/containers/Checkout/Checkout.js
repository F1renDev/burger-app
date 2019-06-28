import React from "react";
import { Route } from "react-router-dom";

import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "./ContactData/ContactData";

/* Gathering the info to be passed to the CheckoutSummary component to display the order */
class Checkout extends React.Component {
    state = {
        ingredients: null,
        totalPrice: 0
    };
    /* Parsing the ingredients and the price from a GET request from the BurgerBuilder component */
    /* Changed from componentDidMount() to avoid the initialization with ingredients being set to 'null' */
    componentWillMount() {
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        let price = 0;
        for (let item of query.entries()) {
            if (item[0] === "price") {
                price = item[1];
            } else {
                ingredients[item[0]] = +item[1];
            }
        }
        this.setState({ ingredients: ingredients, totalPrice: price });
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    };

    checkoutContinuedHandler = () => {
        this.props.history.replace("/checkout/contact-data");
    };

    render() {
        return (
            <div>
                <CheckoutSummary
                    ingredients={this.state.ingredients}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler}
                />
                {/* Using render prop here instead of component prop to pass the ingredients */}
                <Route
                    path={this.props.match.url + "/contact-data"}
                    render={(props) => (
                        <ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props}/>
                    )}
                />
            </div>
        );
    }
}

export default Checkout;
