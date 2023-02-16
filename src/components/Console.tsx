import React from "react";
import styles from "./Console.module.scss";

interface ConsoleProps {
  name: string;
}
export function Console({ name }: ConsoleProps) {
  return (
    <div className={styles.console}>
      <div className={styles.titleBar}>{name}</div>
      <div className={styles.content}></div>
    </div>
  );
}
