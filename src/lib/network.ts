import { JSONObject } from "./types";

export async function postData(
  endPoint: string,
  data: JSONObject
): Promise<string> {
  const response = await fetch(endPoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  reportUsage(json.usage);

  return json.result;
}

interface IUsage {
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  cost: number;
}

function reportUsage(usage?: IUsage) {
  if (!usage) return;
  console.log(
    `$${usage.cost} for ${usage.prompt_tokens} + ${usage.completion_tokens} tokens`
  );
}
