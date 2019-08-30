import React from "react";
import styles from "./NavigationItems.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";

//receiving isAuthenticated prop to conditionally render what is shown to
// authenticated / non-authenticated users

const navigationItems = (props) => (
  <ul className={styles.navigationItems}>
    <NavigationItem link='/' exact>
      Burger Builder
    </NavigationItem>
    {props.isAuthenticated ?<NavigationItem link='/orders'>Orders</NavigationItem> : null}
    {!props.isAuthenticated
     ? <NavigationItem link='/auth'>Log In</NavigationItem>
     : <NavigationItem link='/logout'>Log Out</NavigationItem>
    }
  </ul>
);

export default navigationItems;
