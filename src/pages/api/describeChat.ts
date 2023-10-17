import OpenAI from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function describe2(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("describe2", JSON.stringify(req.body));

  const model = "gpt-3.5-turbo";
  const response = await openai.chat.completions.create({
    model,
    functions: req.body.functions || [],
    function_call: req.body.function_call || "auto",
    messages: [
      {
        role: "system",
        content:
          "You write content for a table top roll playing game. Your writing focuses on lore and physical descriptions and avoids mechanics and rules. You use real words. The setting is high fantasy.",
      },
      {
        role: "user",
        content: req.body.prompt,
      },
    ],
    temperature: 0.7, // 0 (focused) to 2 (creative)
    max_tokens: 200,
  });

  console.log("response", JSON.stringify(response, null, 2));

  const prompt_tokens = response.usage?.prompt_tokens ?? 0;
  const completion_tokens = response.usage?.completion_tokens ?? 0;
  const cost = ((prompt_tokens + completion_tokens) / 1000) * 0.002;
  // console.log(completion.data.choices[0].message);

  res.status(200).json({
    result:
      response.choices[0].message?.content?.trim() ||
      response.choices[0].message?.function_call?.arguments,

    usage: {
      model,
      prompt_tokens,
      completion_tokens,
      cost,
    },
  });
}
