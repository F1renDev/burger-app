import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./NavigationItem.module.css";

const navigationItem = (props) => (
    <li className={styles.navigationItem}>
        <NavLink
            activeClassName={styles.active}
            to={props.link}
            exact={props.exact}>
            {props.children}
        </NavLink>
    </li>
);

export default navigationItem;
