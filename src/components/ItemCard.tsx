import React from "react";
import Image from "next/image";
import { Item } from "../lib/item";
import styles from "./ItemCard.module.scss";

interface Props {
  key: string;
  item: Item;
  description: string;
}

export function ItemCard({ item, description }: Props) {
  return (
    <div className={styles.Item}>
      <div className={styles.json}>{JSON.stringify(item.data, null, 2)}</div>
      <div className={styles.description}>
        <h1>{item.name}</h1>
        <p>{description} </p>
        {Object.entries(item.notes).map(([key, value]) => (
          <div key={key}>
            <h2>{key}</h2>
            <p>{value}</p>
          </div>
        ))}
      </div>
      {item.imageURL && (
        <Image src={item.imageURL} width={512} height={512} alt="bottle" />
      )}
    </div>
  );
}
