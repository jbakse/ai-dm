import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function describe2(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("describe2", req.body);

  const model = "gpt-3.5-turbo";
  const completion = await openai.createChatCompletion({
    model,
    // functions: req.body.functions,
    messages: [
      {
        role: "system",
        content:
          "You write descriptions of fictional items for a table top roll playing game. Your writing focuses on lore and physical descriptions and avoids mechanics and rules. You use real words. Respond with only what is asked for.",
      },
      {
        role: "user",
        content: req.body.prompt,
      },
    ],
    temperature: 0.7, // 0 (focused) to 2 (creative)
    max_tokens: 100,
  });

  const prompt_tokens = completion.data.usage?.prompt_tokens ?? 0;
  const completion_tokens = completion.data.usage?.completion_tokens ?? 0;
  const cost = ((prompt_tokens + completion_tokens) / 1000) * 0.002;
  console.log(completion.data.choices[0].message);

  res.status(200).json({
    result: completion.data.choices[0].message?.content.trim(),
    usage: {
      model,
      prompt_tokens,
      completion_tokens,
      cost,
    },
  });
}
