```javascript
const dataG = { status: "init", value: 0 };

export default function Home() {
const [data, setData] = useState(dataG);

async function test() {
console.log("initial value");

    dataG.status = "pending";
    dataG.value = Math.random();
    setData({ ...dataG });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("complete value");
    dataG.status = "done";
    dataG.value = Math.random();

    // simple way - doesn't work
    // react checks compares the update by identity
    setData(dataG);



    // passing a copy of the mutated data does work, because the identity is different
    setData({ ...data });

    // you can also get the existing state and merge changes into it
    // this also results in a new object
    // setData((oldData) => ({ ...oldData, ...data }));
    // setData((oldData) => ({ ...oldData, status: "done" }));
}
```
