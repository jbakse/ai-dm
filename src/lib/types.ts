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
