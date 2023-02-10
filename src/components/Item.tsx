import styles from "./Item.module.scss";
import Image from "next/image";
export interface IItemProps {
  item: any;
}

export function Item({ item }: IItemProps) {
  let description = {} as any;
  try {
    description = JSON.parse(item.description);
  } catch (error) {
    description.name = "?";
    description.bottle = "?";
    description.poison = "?";
    description.raw = item.description;
  }

  return (
    <div className={styles.Item}>
      <div className={styles.json}>{JSON.stringify(item.data, null, 2)}</div>
      <div className={styles.description}>
        <h1>{description.name}</h1>
        <p>{description.poison}</p>
        <p>{description.bottle}</p>
        {description.raw && <p>{description.raw}</p>}
      </div>
      <Image src={item.image_url} width={512} height={512} alt="bottle" />
    </div>
  );
}
