import React from "react";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends React.Component {
    state = {
        ingredients: {
            salad: 0,
            cheese: 0,
            bacon: 0,
            meat: 0
        },
        totalPrice: 5,
        purchasable: false,
        purchasing: false,
        loading: false
    };

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

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        });
    };

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        });
    };

    purchaseContinueHandler = () => {
        this.setState({ loading: true });
        const price = this.state.totalPrice.toFixed(2);
        const order = {
            ingredients: this.state.ingredients,
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
                this.setState({ loading: false, purchasing: false });
            })
            .catch((error) => {
                this.setState({ loading: false, purchasing: false });
            });
    };

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = (
            <OrderSummary
                price={this.state.totalPrice.toFixed(2)}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                ingredients={this.state.ingredients}
            />
        );
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
    }
}

export default BurgerBuilder;
