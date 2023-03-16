# before immer, this code updated the items array when an item changed

```javascript
function updateItem(item: Item) {
  // replace instances of item in items with a copy of the new item
  setItems((items) => items.map((i) => (i.id === item.id ? { ...item } : i)));
}
```
