import React from "react";

import styles from "./ContactData.module.css";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import axios from "../../../axios-orders";

/* ContactData component to get the user info before placing an order */

class ContactData extends React.Component {
    /* The state contains the identefiers of the form elements + object with configuration setup */
    state = {
        orderForm: {
            name: {
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Your Name"
                },
                value: ""
            },
            street: {
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Street"
                },
                value: ""
            },
            phone: {
                elementType: "input",
                elementConfig: {
                    type: "tel",
                    placeholder: "Your Phone Number",
                    pattern: "[0-9]{3}[0-9]{2}[0-9]{2}[0-9]{2}"
                },
                value: ""
            },
            email: {
                elementType: "input",
                elementConfig: {
                    type: "email",
                    placeholder: "Your E-mail"
                },
                value: ""
            },
            deliveryMethod: {
                elementType: "select",
                elementConfig: {
                    options: [
                        { value: "fastest", displayValue: "Fastest" },
                        { value: "cheapest", displayValue: "Cheapest" }
                    ]
                },
                value: ""
            }
        },
        loading: false
    };

    /* The info about a burger's ingredients and a user who ordered it is sent to firebase db */
    orderHandler = (event) => {
        event.preventDefault();
        // console.log(this.props.ingredients);
        this.setState({ loading: true });
        const price = parseFloat(this.props.price).toFixed(2);
        const formData = {};
        for (let formElementId in this.state.orderForm){
            formData[formElementId] = this.state.orderForm[formElementId].value;
        }
        const order = {
            ingredients: this.props.ingredients,
            price: price,
            orderData: formData
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

    /* Handling the user input */
    inputChangedHandler = (event, inputId) => {
        const updatedOrderForm = {...this.state.orderForm};
        const updatedFormElement = {...updatedOrderForm[inputId]};
        updatedFormElement.value = event.target.value;
        updatedOrderForm[inputId] = updatedFormElement;
        this.setState({orderForm: updatedOrderForm});
    }

    render() {
        /* Turning the orderForm object into an array to loop through */
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        /* The form is created dynamically based on the config in the state */
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map((formElement) => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    />
                ))}
                <Button btnType="success">
                    ORDER
                </Button>
            </form>
        );
        /* The Spinner is shown untill the POST request is executed */
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
