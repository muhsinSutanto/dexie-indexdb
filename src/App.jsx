import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { db } from "./localDb";
import { useLiveQuery } from "dexie-react-hooks";

export default function App({ defaultAge } = { defaultAge: 21 }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState(defaultAge);
  const [status, setStatus] = useState("");

  const { data } = db;
  const items = useLiveQuery(() => data.toArray());

  console.log("data", items);

  async function addFriend() {
    try {
      // Add the new friend!
      const id = await db.friends.add({
        name,
        age,
      });

      setStatus(`Friend ${name} successfully added. Got id ${id}`);
      setName("");
      setAge(defaultAge);
    } catch (error) {
      setStatus(`Failed to add ${name}: ${error}`);
    }
  }

  useEffect(() => {
    async function fetchDataAndSaveToDB() {
      try {
        // Fetch data from the API
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const existingData = await db.data.toArray();
        const data = await response.json();
        const newData = data.filter((item) => {
          !existingData.some((existingItem) => {
            existingItem.name === item.name;
          });
        });
        // console.log(data);

        // Save data to IndexedDB
        // await db.data.bulkAdd(data);
        // console.log("Data saved to IndexedDB successfully!");
        if (newData.length > 0) {
          await db["data"].bulkAdd(newData);
          console.log("New data saved to IndexedDB successfully!");
        } else {
          console.log("No new data to add to IndexedDB.");
        }
      } catch (error) {
        console.error("Error fetching data or saving to IndexedDB:", error);
      }
    }

    fetchDataAndSaveToDB();
  });

  return (
    <>
      <p>{status}</p>
      Name:
      <input
        type="text"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />
      Age:
      <input
        type="number"
        value={age}
        onChange={(ev) => setAge(Number(ev.target.value))}
      />
      <button onClick={addFriend}>Add</button>
    </>
  );
}
