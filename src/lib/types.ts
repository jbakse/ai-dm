export type JSONValue =
  | null
  | string
  | number
  | boolean
  | JSONObject
  | JSONArray;

export type JSONObject = {
  [x: string]: JSONValue; // | (() => string);
};

export type JSONArray = JSONValue[];

export function isJSONObject(o: JSONValue): o is JSONObject {
  return typeof o === "object" && !Array.isArray(o) && o !== null;
}

const x = {} as JSONValue;
if (isJSONObject(x)) {
  x.foo = "bar";
}
