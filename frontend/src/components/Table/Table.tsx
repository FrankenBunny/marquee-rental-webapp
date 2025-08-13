import './Table.css';
import { useEffect, useState } from "react";
import fetchData from "../../services/Api";

interface TableProps {
  endpoint: string;
}

function Table({ endpoint }: TableProps) {
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    async function loadData() {
      const result = await fetchData(endpoint);
      setData(result);
    }

    loadData();
  }, [endpoint]);

  if (data.length === 0) return <div>Loading...</div>;

  const headers = Object.keys(data[0] as object);

  const formatCell = (cell: unknown): string => {
    if (cell === null || cell === undefined) return '';
    if (typeof cell === 'object') {
      // Display nested objects as key-value pairs
      return Object.entries(cell)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
    return String(cell);
  };

  return (
    <div className="table-wrapper">
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
              {headers.map((header) => (
                <td key={header}>{formatCell((row as Record<string, unknown>)[header])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
