import React from "react";
import Head from "next/head";
// import { useState } from "react";
import { useImmer } from "use-immer";
import { ButtonBar } from "../components/ButtonBar";
import { ItemCard } from "../components/ItemCard";
import { Item } from "../lib/item";
import {
  generatePoison,
  describePoisonName,
  describePoisonDescription,
  describePoisonContainer,
} from "../lib/poison";

export default function Home() {
  const [items, setItems] = useImmer([] as Item[]);

  // function updateItem(item: Item) {
  //   // replace instances of item in items with a copy of the new item
  //   setItems((items) => items.map((i) => (i.id === item.id ? { ...item } : i)));
  // }

  async function addPoison() {
    const poison = generatePoison();
    setItems((draft) => {
      draft.push(poison);
    });

    const name = await describePoisonName(poison);
    setItems((draft) => {
      const i = draft.find((i) => i.id === poison.id);
      if (i) i.name = name;
    });

    const description = await describePoisonDescription(poison);
    setItems((draft) => {
      const i = draft.find((i) => i.id === poison.id);
      if (i) i.description = description;
    });

    const container = await describePoisonContainer(poison);
    setItems((draft) => {
      const i = draft.find((i) => i.id === poison.id);
      if (i) i.notes.container = container;
    });
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
          <ItemCard key={item.id} item={item} />
        ))}
      </main>
    </>
  );
}
