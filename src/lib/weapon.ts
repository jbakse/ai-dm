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
    properties: sample(
      ["metal", "wooden", "steel", "silver", "golden", "legendary", "magical"],
      2
    ),
  };
}

export async function describeWeapon(
  weapon: Weapon,
  updateItem: (w: Item) => void
): Promise<void> {
  weapon.name = await describeWeaponName(weapon);
  updateItem(weapon);
  weapon.description = await describeWeaponDescription(weapon);
  updateItem(weapon);
}

export async function describeWeaponName(weapon: Weapon): Promise<string> {
  return await postData("/api/describe", {
    prompt: buildPrompt`
    Create a name for a fictional weapon based on the following json description.

    ${weapon.data}
    `,
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
