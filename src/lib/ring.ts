import { sample, choose } from "./random";
import { Item, makeItem } from "./item";
import { postData } from "./network";
import { buildPrompt } from "./util";

type RingData = ReturnType<typeof generateRingData>;

export interface Ring extends Item {
  type: "poison";
  data: RingData;
}

export function generateRing(): Ring {
  const item = makeItem();
  item.type = "ring";
  item.data = generateRingData();

  return item as Ring;
}

function generateRingData(): object {
  return {
    properties: [
      ...sample(["gold", "silver", "copper", "iron", "steel", "wood"], 1),
      // ...sample(["shiny", "dull", "smooth", "rough", "heavy", "light"], 1),
      ...sample(["simple", "ornate", "plain", "engraved"], 1),
      ...sample(["magical", "mundane"], 1),
    ],
  };
}

export async function describeRing(
  ring: Ring,
  updateItem: (r: Ring) => void
): Promise<void> {
  const json_response = await postData("/api/describeChat", {
    functions: [
      {
        name: "populate_ring",
        description: "Populates the properties of the ring.",
        parameters: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the ring.",
            },
            description: {
              type: "string",
              description: "Description of the ring.",
            },
          },
          required: ["name", "description"],
        },
      },
    ],
    function_call: { name: "populate_ring" },
    prompt: buildPrompt`
    Populate the properties of a ring with the following properties:

    ${ring.data}

    Make the name catchy. eg: 'Ring of the Dragon', 'Eric's Ring of Wishes'
    Keep descriptions under 50 words.

    If the ring is mundane, explicitly state that it is not magical.
    If the ring is magical, alude to magic without specifics.
    `,
  });

  const response = JSON.parse(json_response);
  console.log(json_response, response);

  ring.name = response.name;
  ring.description = response.description;

  updateItem(ring);
}
