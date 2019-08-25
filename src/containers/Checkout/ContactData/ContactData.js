import React from "react";
import styles from "./ContactData.module.css";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import axios from "../../../axios-orders";
import { connect } from "react-redux";

// ContactData component to get the user info before placing an order

class ContactData extends React.Component {
  // The state contains the identefiers of the form elements + object with configuration setup
  state = {
    orderForm: {
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
          required: true
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
    },
    formIsValid: false,
    loading: false
  };

  // The info about a burger's ingredients and a user who ordered it is sent to firebase db
  orderHandler = (event) => {
    event.preventDefault();
    // console.log(this.props.ingredients);
    this.setState({ loading: true });
    const price = parseFloat(this.props.price).toFixed(2);
    const formData = {};
    for (let formElementId in this.state.orderForm) {
      formData[formElementId] = this.state.orderForm[formElementId].value;
    }
    const order = {
      ingredients: this.props.ings,
      price: price,
      orderData: formData
    };
    axios
      .post("/orders.json", order)
      .then((response) => {
        this.setState({ loading: false });
        // Redirectig to the root. Got the 'history' prop by spreading it in the Checkout component
        // The other way is to wrap the ContactData component with 'withRouter'
        this.props.history.push("/");
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  checkValidity = (value, rules) => {
    // isValid is set initially to true because even if one of the if checks in this block returnes false
    // the isValid can be set to true by the last check and thus ingore all the previous checks
    // where it could have been set to false
    let isValid = true;

    if (rules.required) {
      // Using trim() because whitespaces are not treated as empty string
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    return isValid;
  };

  // Handling the user input
  inputChangedHandler = (event, inputId) => {
    const updatedOrderForm = { ...this.state.orderForm };
    const updatedFormElement = { ...updatedOrderForm[inputId] };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
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

    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };

  render() {
    // Turning the orderForm object into an array to loop through
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }

    // The form is created dynamically based on the config in the state
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map((formElement) => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <Button btnType='success' disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );
    // The Spinner is shown untill the POST request is executed
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

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice
  }
}

export default connect(mapStateToProps)(ContactData);
