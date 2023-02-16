import React from "react";
import Head from "next/head";
import { useState } from "react";
import { ButtonBar } from "../components/ButtonBar";
import { ItemCard } from "../components/ItemCard";
import { Item } from "../lib/item";
// import { Console } from "../components/Console";
import {
  generatePoison,
  describePoisonName,
  describePoisonDescription,
  describePoisonContainer,
} from "../lib/poison";

export default function Home() {
  const [items, setItems] = useState([] as Item[]);

  function updateItem(item: Item) {
    // replace instances of item in items with a copy of the new item
    setItems((items) => items.map((i) => (i.id === item.id ? { ...item } : i)));
  }

  async function addPoison() {
    const poison = generatePoison();
    setItems([poison, ...items]);

    // const description = await describePoison(poison.data);
    // poison.name = description.name;
    // poison.description = description.description;
    // poison.notes = description.notes;

    poison.name = await describePoisonName(poison);
    updateItem(poison);

    poison.description = await describePoisonDescription(poison);
    updateItem(poison);

    // have it prompt for the container using the data AND name
    poison.notes.container = await describePoisonContainer(poison);
    updateItem(poison);

    // add console
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
          <ItemCard key={item.id} item={item} description={item.description} />
        ))}
      </main>
      {/* <Console name="GPT" /> */}
    </>
  );
}
