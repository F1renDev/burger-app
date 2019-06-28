import React from "react";

import styles from "./ContactData.module.css";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import axios from "../../../axios-orders";

/* ContactData component to get the user info before placing an order */

class ContactData extends React.Component {
    state = {
        name: "",
        email: "",
        phone: "",
        adress: {
            street: "",
            apartment: ""
        },
        loading: false
    };

    /* Going to send the order data to the database at some point */
    /* TODO: implement the database integration */
    orderHandler = (event) => {
        event.preventDefault();
        // console.log(this.props.ingredients);
        this.setState({ loading: true });
        const price = parseFloat(this.props.price).toFixed(2);
        const order = {
            ingredients: this.props.ingredients,
            price: price,
            customer: {
                name: "Customer-1",
                adress: {
                    street: "CustomerStreet-1"
                },
                phone: "322223",
                email: "CustomerEmail@1.com"
            },
            deliveryMethod: "fastest"
        };
        axios
            .post("/orders.json", order)
            .then((response) => {
                this.setState({ loading: false });
                /* Redirectig to the root. Got the 'history' prop by spreading it in the Checkout component */
                /* The other way is to wrap the ContactData component with 'withRouter' */
                this.props.history.push("/");
            })
            .catch((error) => {
                this.setState({ loading: false });
            });
    };

    render() {
        /* The Spinner is shown untill the POST request is executed */
        let form = (
            <form>
                <input type="text" name="name" placeholder="Your Name" />
                <input type="email" name="email" placeholder="Your Mail" />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone Number"
                    pattern="[0-9]{3}[0-9]{2}[0-9]{2}[0-9]{2}"
                />
                <input type="text" name="street" placeholder="Street" />
                <input type="number" name="apartment" placeholder="Apartment" />
                <br />
                <Button btnType="success" clicked={this.orderHandler}>
                    ORDER
                </Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner />;
        }
        return (
            <div className={styles.contactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;
