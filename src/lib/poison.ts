import pick from "lodash/pick";
import { sample, choose } from "./random";
import { Item, makeItem } from "./item";
import { postData } from "./network";
import { buildPrompt } from "./util";

type PoisonData = ReturnType<typeof generatePoisonData>;

const theme = "fantasy rpg";

export interface Poison extends Item {
  type: "poison";
  data: PoisonData;
}

export function generatePoison(): Poison {
  const item = makeItem();
  item.type = "poison";
  item.data = generatePoisonData();

  return item as Poison;
}

function generatePoisonData(): object {
  return {
    properties: sample(colors, 1),
    ingredients: [...sample(poisons, 1), ...sample(herbs, 2)],
    effects: [generateEffect()],
    containerProperties: [
      ...sample(containerTypes),
      ...sample(containerProperties, 2),
    ],
  };
}

function generateEffect() {
  const effect = {
    effect: Math.random() > 0.5 ? "reduce" : "improve",
    stat: choose(stats),
    amount: choose(degrees),
    duration: choose(durations),
    // summarize: function () {
    //   return `${this.amount.name}ly ${this.effect} ${this.stat} for ${this.duration}}`;
    // },
  };

  return effect;
}

export async function* describePoison(poison: Poison): AsyncGenerator<Poison> {
  poison.name = await describePoisonName(poison);
  yield poison;
  poison.description = await describePoisonDescription(poison);
  yield poison;
  poison.notes.container = await describePoisonContainer(poison);
  yield poison;
}

export async function describePoisonName(poison: Poison): Promise<string> {
  return await postData("/api/describe", {
    prompt: buildPrompt`
    Create a name for a fictional poison based on the following json description.

    ${pick(poison.data, ["properties", "ingredients", "effects"])}
    `,
    logit_bias: {
      8764: -10, // poison
      // 15_931: -10, // ""
      // 1: -10, // "
    },
  });
}

export async function describePoisonDescription(
  poison: Poison
): Promise<string> {
  return await postData("/api/describe", {
    // prettier-ignore
    prompt: buildPrompt`
    Breifly describe a fictional poison named ${poison.name} based on the following json description.
    Embellish.
    ${pick(poison.data, ["properties", "ingredients", "effects"])}
  `,
    max_tokens: 100,
  });
}

// describePoisonContainer
export async function describePoisonContainer(poison: Poison): Promise<string> {
  // prettier-ignore
  return await postData("/api/describe", {
    // prettier-ignore
    prompt: buildPrompt`
    Breifly describe the conainter of a fictional poison named ${poison.name} based on the following json description.
    Use a ${theme} theme.
    ${pick(poison.data, ["containerProperties"])}
  `,
    max_tokens: 100,
  });
}

const degrees = [
  { name: "mild", value: 1 },
  { name: "moderate", value: 2 },
  { name: "strong", value: 3 },
];

const containerTypes = [
  //
  "bottle",
  "flask",
  "vial",
  "jar",
  "canister",
];

const containerProperties = [
  //
  "transparent",
  "opaque",
  "frosted",
  "clear",
  "tinted",
  "shiny",
  "matte",
  "rounded",
  "squared",
  "narrow",
  "wide",
  "tall",
  "short",
  "durable",
  "fragile",
  "lightweight",
  "heavy",
];

const colors = [
  //
  "brown",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
  "black",
  "gray",
  "white",
  "gold",
  "silver",
];

const poisons = [
  //
  "Belladonna",
  "Hemlock",
  "Monkshood",
  "Jimsonweed",
  "Foxglove",
  "Oleander",
  "Yew",
  "Castor Bean",
  "Larkspur",
  "Water Hemlock",
];

const herbs = [
  "Chamomile",
  "Lavender",
  "Peppermint",
  "Echinacea",
  "Ginger",
  "Calendula",
  "Rose",
  "Hibiscus",
  "Lemon balm",
  "St John's Wort",
];

const stats = [
  //
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

const durations = [
  //
  "1 minute",
  "10 minutes",
  "1 hour",
  "6 hours",
  "1 day",
];

// export async function describePoison(data: JSONValue) {
//   const result = await postData("/api/describe", {
//     prefix: `Describe a fantasy poison based on the following json.
//       Embellish. Avoid numbers.
//       Return result as only a json object with the following fields:
//       name: short distictive name
//       poison: physical description of the poison including flavor, smell, appearance, and effects
//       container: physical descritpion of the container
//       `,
//     item: data,
//   });

//   console.log("describePoison", result);

//   let o: JSONObject;
//   try {
//     o = JSON.parse(result);
//     if (o === null || typeof o !== "object") o = {};
//   } catch {
//     o = {};
//   }

//   return {
//     name: o.name?.toString() ?? "unnamed poison",
//     description: o.poison?.toString() ?? "undescribed poison",
//     notes: {
//       container: o.container?.toString() ?? "undescribed bottle",
//     },
//   };
// }

// async function illustratePoison(description: string, data: any) {
//   let prompt;

//   try {
//     prompt = `High Fantasy, Digital Art, Bottle of Poison, Game Asset
//     ${JSON.parse(description).bottle}
//     `;
//   } catch {
//     prompt = `High Fantasy, Digital Art, Bottle of Poison, Game Asset
//   ${data.bottle.join(" ")},
//   ${data.colors.join(" ")},
//   ${data.ingredients.join(", ")}
//   `;
//   }

//   const response = await postData("/api/illustrate", { prompt });

//   return response.url;
// }
