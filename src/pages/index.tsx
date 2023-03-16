import React from "react";
import Head from "next/head";
// import { useState } from "react";
import { useImmer } from "use-immer";
import { setAutoFreeze } from "immer";
import { ButtonBar } from "../components/ButtonBar";
import { ItemCard } from "../components/ItemCard";
import { Item } from "../lib/item";
import {
  generatePoison,
  describePoisonName,
  describePoisonDescription,
  describePoisonContainer,
  describePoison,
} from "../lib/poison";

export default function Home() {
  const [items, setItems] = useImmer([] as Item[]);

  async function addPoison() {
    const poison = generatePoison();
    setAutoFreeze(false);
    setItems((draft) => {
      draft.push(poison);
    });

    for await (const p of describePoison(poison)) {
      setItems((draft) => {
        const i = draft.findIndex((i) => i.id === poison.id);
        if (i > -1) draft[i] = { ...p };
      });
    }
    // const name = await describePoisonName(poison);
    // poison.name = name;
    // setItems((draft) => {
    //   const i = draft.find((i) => i.id === poison.id);
    //   if (i) i.name = name;
    // });

    // const description = await describePoisonDescription(poison);
    // setItems((draft) => {
    //   const i = draft.find((i) => i.id === poison.id);
    //   if (i) i.description = description;
    // });

    // const container = await describePoisonContainer(poison);
    // setItems((draft) => {
    //   const i = draft.find((i) => i.id === poison.id);
    //   if (i) i.notes.container = container;
    // });
  }

  const buttons = [{ name: "Poison", action: addPoison }];

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
