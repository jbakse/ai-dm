import * as React from "react";

export interface IButtonBarProps {
  buttons: { name: string; action: () => void }[];
}

export function ButtonBar({ buttons }: IButtonBarProps) {
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
