import pick from "lodash/pick";
import { buildPrompt } from "./util";

export const promptName = {
  prompt: (context) => buildPrompt`
    Create a name for a fictional poison based on the following json description.

    ${pick(context.poison.data, ["properties", "ingredients", "effects"])}
     
    Return only the name. Do not include any puntuation.
    `,
};
