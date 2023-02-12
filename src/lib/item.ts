import { JSONValue } from "./types";

export type ItemType = string;
export interface Item {
  id: string;
  type: ItemType;
  data: JSONValue;
  name: string;
  description: string;
  notes: Record<string, string>;
  imageURL?: string;
}

export function makeItem(): Item {
  return {
    id: Math.random().toString(36).slice(2),
    type: "item",
    data: {},
    name: "unnamed",
    description: "undescribed",
    notes: {},
  };
}
