import React from "react";
import { JSONValue } from "../lib/types";

interface Props {
  data: JSONValue;
}

export function ShowJSON({ data }: Props) {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
