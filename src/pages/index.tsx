import React from "react";
import Head from "next/head";
import { useState } from "react";
import { ButtonBar } from "../components/ButtonBar";
import { ItemCard } from "../components/ItemCard";
import { Item } from "../lib/item";
import { generatePoison, describePoison } from "../lib/poison";

export default function Home() {
  const [items, setItems] = useState([] as Item[]);

  async function addPoison() {
    const poison = generatePoison();
    setItems([...items, poison]);

    const description = await describePoison(poison.data);
    poison.name = description.name;
    poison.description = description.description;
    poison.notes = description.notes;

    // this next bit is a bit crazy, since you can't just
    // update a deep property...
    // replace instances of p with a copy of the updated p
    setItems((items) =>
      items.map((item) => (item === poison ? { ...poison } : item))
    );
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
    </>
  );
}
