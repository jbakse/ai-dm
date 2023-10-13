import React from "react";
import Head from "next/head";
import { create } from "zustand";
import { ButtonBar } from "../components/ButtonBar";
import { ItemCard } from "../components/ItemCard";
import { Item } from "../lib/item";
import { generatePoison, describePoison } from "../lib/poison";
import { generateWeapon, describeWeapon } from "../lib/weapon";

interface ItemsState {
  items: Item[];
  add: (item: Item) => void;
  update: (item: Item) => void;
}

export const useItems = create<ItemsState>((set) => ({
  items: [],
  add: (item: Item) => set((state) => ({ items: [...state.items, item] })),
  update: (item: Item) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === item.id ? { ...item } : i)),
    })),
}));

export default function Home() {
  // const [items, setItems] = useImmer([] as Item[]);
  const items = useItems((state) => state.items);
  const addItem = useItems((state) => state.add);
  const updateItem = useItems((state) => state.update);

  async function addPoison() {
    const poison = generatePoison();
    addItem(poison);
    describePoison(poison, updateItem);
  }

  async function addWeapon() {
    const weapon = generateWeapon();
    addItem(weapon);
    describeWeapon(weapon, updateItem);
  }

  const buttons = [
    { name: "Poison", action: addPoison },
    { name: "Weapon", action: addWeapon },
  ];

  console.log(items);
  return (
    <>
      <Head>
        <title>AI DM</title>
      </Head>
      <main>
        <h1>AI DM</h1>

        <ButtonBar buttons={buttons} />

        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </main>
    </>
  );
}
