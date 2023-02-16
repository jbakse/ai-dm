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
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      // https://platform.openai.com/docs/models/gpt-3
      model: "text-davinci-003",
      // model: "text-curie-001",
      // model: "text-babbage-001",
      // model: "text-ada-001",
      prompt: req.body.prompt,
      temperature: 0.8,
      max_tokens: 200,
    });

    console.log("body", req.body);
    console.log("completion", completion.data.choices);

    // console.log("describe", JSON.stringify(completion.data, null, 2));
    res
      .status(200)
      .json({ result: completion?.data?.choices?.[0]?.text?.trim() });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
