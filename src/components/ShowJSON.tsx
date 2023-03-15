import React from "react";
import { JSONValue } from "../lib/types";
import styles from "./ShowJSON.module.scss";
interface Props {
  data: JSONValue;
}

export function ShowJSON({ data }: Props) {
  return <pre className={styles.ShowJSON}>{JSON.stringify(data, null, 2)}</pre>;
}
