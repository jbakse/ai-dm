import Head from "next/head";
import { ButtonBar } from "../components/ButtonBar";
import { Item } from "../components/Item";
import { useState } from "react";
import { postData } from "../lib/network";

const degrees = [
  { name: "mild", value: 1 },
  { name: "moderate", value: 2 },
  { name: "strong", value: 3 },
];

const bottleProperties = [
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

const poisonIngredients = [
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
const mundaneIngredients = [
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
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

const durations = ["1 minute", "10 minutes", "1 hour", "6 hours", "1 day"];

// sample, provides n random elements from an array
function sample<T>(array: T[], n = 1): T[] {
  if (n > array.length) {
    return [...array];
  }

  const result = [];
  const copy = [...array];
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy[index]);
    copy.splice(index, 1);
  }
  return result;
}

// pick, provides a random element from an array
function pick<T>(array: T[]): T {
  return sample(array)[0];
}

function makeEffect() {
  const effect = {} as any;
  effect.stat = pick(stats);
  effect.effect = Math.random() > 0.5 ? "reduce" : "improve";
  effect.degree = pick(degrees);
  effect.duration = pick(durations);
  return effect;
}
function makePoison(): any {
  const data = {} as any;
  data.id = Math.random().toString(36).substring(2);
  data.type = "poison";
  data.bottle = sample(bottleProperties, 2);
  data.colors = sample(colors);
  data.ingredients = Array.prototype.concat(
    sample(poisonIngredients, 1),
    sample(mundaneIngredients, 2)
  );
  data.effects = [makeEffect(), makeEffect()];

  return { data };
}

async function describePoison(data: any) {
  const response = await postData("/api/describe", {
    prefix: `Describe a fantasy poison based on the following json. 
      Embellish. Avoid numbers.
      Return result as json object with the following fields:
      name: short distictive name
      bottle: physical descritpion of the bottle
      posion: physical description of the poison including flavor, smell, appearance, and effects
      `,
    item: data,
  });
  return response.result;
}

async function illustratePoison(description: string, data: any) {
  let prompt;

  try {
    prompt = `High Fantasy, Digital Art, Bottle of Poison, Game Asset
    ${JSON.parse(description).bottle}
    `;
  } catch (error) {
    prompt = `High Fantasy, Digital Art, Bottle of Poison, Game Asset
  ${data.bottle.join(" ")},
  ${data.colors.join(" ")},
  ${data.ingredients.join(", ")}
  `;
  }

  console.log("prompt", prompt);
  const image_url = (await postData("/api/show", { prompt })).url;
  console.log("url", image_url);
  return image_url;
}

export default function Home() {
  const [items, setItems] = useState([] as any[]);

  async function addPoison() {
    const newPoison = makePoison();
    newPoison.description = await describePoison(newPoison.data);
    newPoison.image_url = await illustratePoison(
      newPoison.description,
      newPoison.data
    );

    setItems([...items, newPoison]);
  }
  const buttons = [{ name: "Poison", action: addPoison }];

  return (
    <>
      <Head>
        <title>AI DM</title>
      </Head>
      <main>
        <h1>AI DM</h1>
        <ButtonBar buttons={buttons} />
        {items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </main>
    </>
  );
}
