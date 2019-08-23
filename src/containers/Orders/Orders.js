import React from "react";

import Order from "../../components/Order/Order";
import axios from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

// Component for outputting multiple orders
class Orders extends React.Component {
  state = {
    orders: [],
    loading: true
  };

  componentDidMount() {
    // Getting the orders from firebase
    axios
      .get("/orders.json")
      .then((res) => {
        const fetchedOrders = [];
        for (let item in res.data) {
          fetchedOrders.push({
            ...res.data[item],
            id: item
          });
        }
        this.setState({ loading: false, orders: fetchedOrders });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <div>
        {this.state.orders.map((order) => (
          <Order
            key={order.id}
            ingredients={order.ingredients}
            price={order.price}
          />
        ))}
      </div>
    );
  }
}

export default withErrorHandler(Orders, axios);
