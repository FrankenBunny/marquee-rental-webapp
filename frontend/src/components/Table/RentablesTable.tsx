import './Table.css';
import { useEffect, useState } from "react";
import fetchData from "../../services/Api";

interface Availability {
  total: number;
  maintenance: number;
  broken: number;
}

interface Rentable {
  id: string;
  name: string;
  description?: string | null;
  availability: Availability;
}

function RentablesTable() {
  const [rentables, setRentables] = useState<Rentable[]>([]);

  useEffect(() => {
    async function loadRentables() {
      const result = await fetchData("inventory/rentable"); // your endpoint
      setRentables(result);
    }

    loadRentables();
  }, []);

  if (rentables.length === 0) return <div>Loading...</div>;

  return (
    <div className="table-wrapper">
      <table className="reusable-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Total</th>
            <th>Maintenance</th>
            <th>Broken</th>
          </tr>
        </thead>
        <tbody>
          {rentables.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.description ?? "-"}</td>
              <td>{r.availability.total}</td>
              <td>{r.availability.maintenance}</td>
              <td>{r.availability.broken}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RentablesTable;
