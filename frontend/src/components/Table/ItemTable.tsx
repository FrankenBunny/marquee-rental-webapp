import { useEffect, useState } from "react";
import fetchData from "../../services/Api";
import "./Table.css";

interface Item {
  id: number;
  name: string;
  description: string;
  availability: {
    id: number;
    total: number;
    maintenance: number;
    broken: number;
  } | null;
}

export default function ItemTable() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    async function loadItems() {
      const result = await fetchData("inventory/item");
      setItems(result);
    }
    loadItems();
  }, []);

  if (items.length === 0) return <div>Loading...</div>;

  return (
    <div className="table-wrapper">
      <table className="reusable-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>DESCRIPTION</th>
            <th>AVAILABILITY (total / maintenance / broken)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>
                {item.availability
                  ? `${item.availability.total} / ${item.availability.maintenance} / ${item.availability.broken}`
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
