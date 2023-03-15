import { Configuration, OpenAIApi } from "openai";
import { RequiredError } from "openai/dist/base";
import type { NextApiRequest, NextApiResponse } from "next";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const config = {
  // https://platform.openai.com/docs/models/gpt-3
  model: "text-davinci-003",
  //  model: "text-curie-001",
  //  model: "text-babbage-001",
  //  model: "text-ada-001",
  temperature: 0.8,
  max_tokens: 200,
} as const;

const costs = {
  "text-davinci-003": 0.02,
  "text-curie-001": 0.002,
  "text-babbage-001": 0.0005,
  "text-ada-001": 0.0004,
};

export default async function describe2(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const completion = await openai.createCompletion({
      model: config.model,
      temperature: config.temperature,
      max_tokens: config.max_tokens,
      prompt: req.body.prompt,
    });

    const prompt_tokens = completion.data.usage?.prompt_tokens ?? 0;
    const completion_tokens = completion.data.usage?.completion_tokens ?? 0;
    const cost =
      ((prompt_tokens + completion_tokens) / 1000) * costs[config.model];

    res.status(200).json({
      result: completion.data.choices[0].text?.trim() || "",
      usage: {
        model: config.model,
        prompt_tokens,
        completion_tokens,
        cost,
      },
    });
  } catch (error: unknown) {
    if (error instanceof RequiredError) {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
    console.log("error", error);
  }
}
