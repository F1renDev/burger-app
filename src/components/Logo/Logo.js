import React from 'react';
import burgerLogo from '../../assets/images/burger-logo.png';
import styles from './Logo.module.css'

const logo = (props) => (
    <div className={styles.logo} style={{height: props.height, margin: props.margin}}>
        <img src={burgerLogo} alt="MyBurger"/>
    </div>
);

export default logo;