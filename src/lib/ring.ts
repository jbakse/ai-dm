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
    properties: "gold",
  };
}

export async function describeRing(
  ring: Ring,
  updateItem: (r: Ring) => void
): Promise<void> {
  ring.name = await postData("/api/describeChat", {
    functions: [
      {
        name: "populate_ring",
        description: "Populates the properties of the ring.",
        parameters: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the ring." },
            description: {
              type: "string",
              description: "Description of the ring.",
            },
            required: ["name", "description"],
          },
        },
      },
    ],
    prompt: buildPrompt`
    Populate the properties of a ring with the following properties:

    ${ring.data}
    `,
  });
  updateItem(ring);
}
