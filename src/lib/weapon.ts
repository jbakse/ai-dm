import { useItems } from "../pages/index";
import { sample, choose } from "./random";
import { Item, makeItem } from "./item";
import { postData } from "./network";
import { buildPrompt } from "./util";
type WeaponData = ReturnType<typeof generateWeaponData>;

export interface Weapon extends Item {
  type: "weapon";
  data: WeaponData;
}

export function generateWeapon(): Weapon {
  const item = makeItem();
  item.type = "weapon";
  item.data = generateWeaponData();

  return item as Weapon;
}

function generateWeaponData(): object {
  return {
    type: choose(["sword", "axe", "spear", "bow", "dagger", "mace", "staff"]),
    properties: [
      sample(["wooden", "bronze", "iron", "steel", "silver", "golden"]),
      sample(["old", "damaged", "weathered", "clean", "new", "broken"]),
      sample(["crude", "plain", "ornate", "well-crafted"]),
      sample(["mudane", "mundane", "simple", "simple", "magical", "enchanted"]),
    ].flat(),
  };
}

export async function describeWeapon(
  weapon: Weapon,
  updateItem: (w: Item) => void
): Promise<void> {
  // console.log("useItems", useItems.getState());
  weapon.name = await describeWeaponName(weapon);
  // updateItem(weapon);
  useItems.getState().update(weapon);
  weapon.description = await describeWeaponDescription(weapon);
  // updateItem(weapon);
  useItems.getState().update(weapon);
}

export async function describeWeaponName(weapon: Weapon): Promise<string> {
  return await postData("/api/describe", {
    prompt: buildPrompt`
    Create a name for a fictional weapon based on the following json description. Avoid using words in the json.

    ${weapon.data}
    `,
    temperature: 1.5,
    logit_bias: {
      8764: -10, // poison
      15_931: -10, // ""
      1: -10, // "
      13_538: -10, // _""
    },
  });
}

export async function describeWeaponDescription(
  weapon: Weapon
): Promise<string> {
  return await postData("/api/describe", {
    // prettier-ignore
    prompt: buildPrompt`
    Breifly describe a fictional weapon named ${weapon.name} based on the following json description.
    Embellish.
    ${weapon.data}
  `,
    max_tokens: 100,
  });
}
