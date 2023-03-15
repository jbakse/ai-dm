import React from "react";
import Image from "next/image";
import { Item } from "../lib/item";
import { ShowJSON } from "./ShowJSON";
import styles from "./ItemCard.module.scss";

interface Props {
  key: string;
  item: Item;
}

export function ItemCard({ item }: Props) {
  return (
    <div className={styles.ItemCard}>
      <ShowJSON data={item.data} />
      <div className={styles.description}>
        <h1>{item.name}</h1>
        <p>{item.description} </p>
        <ul className={styles.notes}>
          {Object.entries(item.notes).map(([key, value]) => (
            <li key={key}>
              <h2>{key}</h2>
              <p>{value}</p>
            </li>
          ))}
        </ul>
      </div>
      {item.imageURL && (
        <Image src={item.imageURL} width={512} height={512} alt="bottle" />
      )}
    </div>
  );
}
