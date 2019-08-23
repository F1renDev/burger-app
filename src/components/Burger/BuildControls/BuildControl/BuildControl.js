import React from "react";
import styles from "./BuildControl.module.css";

// a single build control for a single ingredient ( add/delete )
const buildControl = (props) => (
  <div className={styles.buildControl}>
    <div className={styles.label}>{props.label}</div>
    <button
      onClick={props.removed}
      className={styles.less}
      disabled={props.disabled}>
      Less
    </button>
    <button onClick={props.added} className={styles.more}>
      More
    </button>
  </div>
);

export default buildControl;
