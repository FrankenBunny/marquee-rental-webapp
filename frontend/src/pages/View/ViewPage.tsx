import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ViewPage.css";

const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_DEV_URL;

function ViewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [rowData, setRowData] = useState<Record<string, unknown> | null>(
    (location.state as Record<string, unknown>) || null
  );

  useEffect(() => {
    if (!rowData && id) {
      fetch(`${API_URL}/api/inventory/rentable/${id}`)
        .then((res) => res.json())
        .then((data) => setRowData(data))
        .catch((err) => console.error("Failed to fetch rentable:", err));
    }
  }, [id, rowData]);

  const renderValue = (key: string, value: unknown) => {
    if (value === null || value === undefined) return "";

    // Availability table
    if (
      key === "availability" &&
      typeof value === "object" &&
      value !== null &&
      "total" in (value as Record<string, unknown>)
    ) {
      const a = value as { total: number; maintenance: number; broken: number };
      return (
        <table className="mini-table">
          <thead>
            <tr>
              <th>Total</th>
              <th>Maintenance</th>
              <th>Broken</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{a.total}</td>
              <td>{a.maintenance}</td>
              <td>{a.broken}</td>
            </tr>
          </tbody>
        </table>
      );
    }

    // Parts mini-table
    if (key === "parts" && Array.isArray(value)) {
      if (value.length === 0) return "No parts";
      return (
        <table className="mini-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {value.map((part: any, idx) => (
              <tr key={idx}>
                <td>{part.name}</td>
                <td>{part.description || ""}</td>
                <td>{part.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Generic object
    if (typeof value === "object") {
      return Object.entries(value)
        .filter(([k]) => k !== "id")
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
    }

    // Primitive
    return String(value);
  };

  if (!rowData) {
    return (
      <div className="viewpage-wrapper">
        <div className="viewpage-container">
          <h2>Loading...</h2>
          <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="viewpage-wrapper">
      <div className="viewpage-container">
        <h1 className="viewpage-title">Details</h1>
        <table className="reusable-table">
          <thead>
            <tr>
              <th>FIELD</th>
              <th>VALUE</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rowData).map(([key, value]) => {
              // Skip has_parts if parts exist
              if (key === "has_parts" && Array.isArray(rowData.parts) && rowData.parts.length > 0) {
                return null;
              }

              return (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{renderValue(key, value)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
}

export default ViewPage;
