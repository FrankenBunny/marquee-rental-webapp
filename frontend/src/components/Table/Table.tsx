import './Table.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchData from "../../services/Api";
import { FaEye, FaEdit } from "react-icons/fa";

interface TableProps {
  endpoint: string;
}

function Table({ endpoint }: TableProps) {
  const [data, setData] = useState<unknown[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const navigate = useNavigate();

  const visibleColumns = ["name", "description", "availability"];

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchData(endpoint);
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("API did not return an array:", result);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching table data:", error);
        setData([]);
      }
    }
    loadData();
  }, [endpoint]);

  // Guard for missing or empty data
  if (!Array.isArray(data) || data.length === 0) {
    return <div>Loading...</div>;
  }

  const formatCell = (cell: unknown): string => {
    if (cell === null || cell === undefined) return '';
    if (typeof cell === 'object') {
      return Object.entries(cell)
        .filter(([key]) => key !== 'id') // Remove id field
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
    return String(cell);
  };

  const sortData = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    setData((prevData) =>
      [...prevData].sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[key];
        const bVal = (b as Record<string, unknown>)[key];
        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        return direction === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      })
    );
  };

  return (
    <div className="table-wrapper">
      <table className="reusable-table">
        <thead>
          <tr>
            {visibleColumns.map((header) => (
              <th
                key={header}
                onClick={() => sortData(header)}
                className={sortConfig?.key === header ? `sorted-${sortConfig.direction}` : ''}
              >
                {header.toUpperCase()}
              </th>
            ))}
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {visibleColumns.map((header) => (
                <td key={header}>{formatCell((row as Record<string, unknown>)[header])}</td>
              ))}
             <td className="action-buttons">
              <button
                className="icon-btn view-btn"
                onClick={() => navigate(`/view/${(row as any).id}`, { state: row })}
                title="View"
              >
                <FaEye />
              </button>
              <button
                className="icon-btn edit-btn"
                onClick={() => navigate(`/edit/${(row as any).id}`, { state: row })}
                title="Edit"
              >
                <FaEdit />
              </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
