// defines a type for a JSON serializable value

export type JSONValue = null | string | number | boolean | object;

// better definition for a JSON serializable value
// but this breaks when used with immer with
// "Type instantiation is excessively deep and possibly infinite. ts(2589)"
// export type JSONValue =
//   | null
//   | string
//   | number
//   | boolean
//   | JSONObject
//   | JSONArray;

// export type JSONObject = { [x: string]: JSONValue };
// export type JSONArray = JSONValue[];

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
