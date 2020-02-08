import React, { useState } from "react";
import styles from "./ContactData.module.css";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import axios from "../../../axios-orders";
import { connect } from "react-redux";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";
import { checkValidity } from "../../../shared/utility";

// ContactData component to get the user info before placing an order

const ContactData = props => {
  // The state contains the identefiers of the form elements + object with configuration setup
  const [orderForm, setOrderForm] = useState({
    name: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Your Name"
      },
      value: "",
      // Checking the validity of user's input
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    street: {
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Street"
      },
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    phone: {
      elementType: "input",
      elementConfig: {
        type: "tel",
        placeholder: "Your Phone Number"
      },
      value: "",
      validation: {
        required: true,
        minLength: 9,
        maxLength: 9
      },
      valid: false,
      touched: false
    },
    email: {
      elementType: "input",
      elementConfig: {
        type: "email",
        placeholder: "Your E-mail"
      },
      value: "",
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    deliveryMethod: {
      elementType: "select",
      elementConfig: {
        options: [
          { value: "fastest", displayValue: "Fastest" },
          { value: "cheapest", displayValue: "Cheapest" }
        ]
      },
      value: "fastest",
      validation: {
        required: false
      },
      valid: true,
      touched: false
    }
  });
  const [formIsValid, setFormIsValid] = useState(false);

  // The info about a burger's ingredients and a user who ordered it is sent to firebase db
  const orderHandler = event => {
    event.preventDefault();

    const price = parseFloat(props.price).toFixed(2);
    const formData = {};
    // eslint-disable-next-line no-unused-vars
    for (let formElementId in orderForm) {
      formData[formElementId] = orderForm[formElementId].value;
    }
    const order = {
      ingredients: props.ings,
      price: price,
      orderData: formData,
      userId: props.userId
    };
    props.onOrderBurger(order, props.token);
  };

  // Handling the user input
  const inputChangedHandler = (event, inputId) => {
    const updatedOrderForm = { ...orderForm };
    const updatedFormElement = { ...updatedOrderForm[inputId] };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    updatedOrderForm[inputId] = updatedFormElement;
    // If all inputs have valid === true the overall form receives formIsValid === true
    // so that it is only submitted to the firebase if everything is valid

    // formIsValid is set initially to true because even if one iteration returnes false
    // the formIsValid can be set to true by the last iteration and thus ingore
    // all the previous iterations where it could have been set to false
    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    setOrderForm(updatedOrderForm);
    setFormIsValid(formIsValid);
  };

  // Turning the orderForm object into an array to loop through
  const formElementsArray = [];
  // eslint-disable-next-line no-unused-vars
  for (let key in orderForm) {
    formElementsArray.push({
      id: key,
      config: orderForm[key]
    });
  }

  // The form is created dynamically based on the config in the state
  let form = (
    <form onSubmit={orderHandler}>
      {formElementsArray.map(formElement => (
        <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          changed={event => inputChangedHandler(event, formElement.id)}
        />
      ))}
      <Button btnType="success" disabled={!formIsValid}>
        ORDER
      </Button>
    </form>
  );
  // The Spinner is shown untill the POST request is executed
  if (props.loading) {
    form = <Spinner />;
  }
  return (
    <div className={styles.contactData}>
      <h4>Enter your contact data</h4>
      {form}
    </div>
  );
};

// getting the state from the redux store
const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) =>
      dispatch(actions.purchaseBurger(orderData, token))
  };
};

//connecting the component and the redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));
