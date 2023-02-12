import * as React from "react";

export interface Props {
  buttons: { name: string; action: () => void }[];
}

export function ButtonBar({ buttons }: Props) {
  return (
    <ul>
      {buttons.map((button) => (
        <li key={button.name}>
          <button onClick={button.action}>{button.name}</button>
        </li>
      ))}
    </ul>
  );
}
