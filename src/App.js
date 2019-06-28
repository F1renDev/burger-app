import React from "react";
import { Route, Switch } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Checkout from "./containers/Checkout/Checkout";
import Orders from './containers/Orders/Orders';

class App extends React.Component {
    render() {
        return (
            <div>
                <Layout>
                    {/* Displaying either the burger builder or the checkout page */}
                    <Switch>
                        <Route path="/checkout" component={Checkout} />
                        <Route path='/orders' component={Orders} />
                        <Route path="/" exact component={BurgerBuilder} />
                    </Switch>
                </Layout>
            </div>
        );
    }
}

export default App;
