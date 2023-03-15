// defines a type for a JSON serializable value
// this compact version is from
// https://dev.to/ankittanna/how-to-create-a-type-for-complex-json-object-in-typescript-d81

type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

// defines a type for a JSON serializable value
// this was working well until combined with immer which led to error:
// "Type instantiation is excessively deep and possibly infinite"

// export type JSONValue =
//   | null
//   | string
//   | number
//   | boolean
//   | JSONObject
//   | JSONArray;

// export type JSONObject = {
//   [x: string]: JSONValue;
// };

// export type JSONArray = JSONValue[];

// export function isJSONObject(o: JSONValue): o is JSONObject {
//   return typeof o === "object" && !Array.isArray(o) && o !== null;
// }

interface Summarizable {
  summarize(): string;
}

function isSummarizable(obj: unknown): obj is Summarizable {
  return typeof (obj as Summarizable)?.summarize === "function";
}

export function summarizer(key: string, value: unknown): JSONValue {
  if (isSummarizable(value)) {
    return value.summarize() as JSONValue;
  } else {
    return value as JSONValue;
  }
}
