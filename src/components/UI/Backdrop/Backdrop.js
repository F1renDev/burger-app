import React from "react";
import styles from "./Backdrop.module.css";

const backdrop = (props) =>
  props.show ? (
    <div onClick={props.clicked} className={styles.backdrop} />
  ) : null;

export default backdrop;
