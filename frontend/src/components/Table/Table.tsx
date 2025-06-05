import './Table.css'
import { useEffect, useState } from "react"
import fetchData from "../../services/Api";

interface TableProps {
  endpoint: string;
}
function Table({endpoint}: TableProps) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const result = await fetchData(endpoint);
      setData(result);
    }

    loadData();
  }, []);

  if (data.length === 0) return <div>Loading...</div>;

  const headers = Object.keys(data[0]);

  return (
    <>
      <table className="reusable-table">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => {
                const cell = row[header];
                return <td key={header}>{cell != null ? String(cell) : ''}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Table
