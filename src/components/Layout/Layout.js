import React from "react";
import styles from "./Layout.module.css";
import Toolbar from "../Navigation/Toolbar/Toolbar";
import SideDrawer from "../Navigation/SideDrawer/SideDrawer";

class Layout extends React.Component {
    state = {
        showSideDrawer: false
    };

    sideDrawerClosedHandler = () => {
        this.setState({
            showSideDrawer: false
        });
    };

    sideDrawerToggleHandler = () => {
        this.setState((updater) => {
            return { showSideDrawer: !updater.showSideDrawer };
        });
    };

    render() {
        return (
            <React.Fragment>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
                <SideDrawer
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler}
                />
                <main className={styles.content}>{this.props.children}</main>
            </React.Fragment>
        );
    }
}

export default Layout;
