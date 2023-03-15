import * as React from "react";
import styles from "./ButtonBar.module.scss";

export interface Props {
  buttons: { name: string; action: () => void }[];
}

export function ButtonBar({ buttons }: Props) {
  return (
    <ul className={styles.ButtonBar}>
      {buttons.map((button) => (
        <li key={button.name}>
          <button onClick={button.action}>{button.name}</button>
        </li>
      ))}
    </ul>
  );
}
