import { JSONObject } from "./types";

export async function postData(
  endPoint: string,
  data: JSONObject
): Promise<string> {
  const response = await fetch(endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const json = await response.json();

  return json.result;
}
