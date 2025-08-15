import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PartPage.css";

const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_DEV_URL;

interface Part {
  id?: string;
  name: string;
  description: string | null;
  quantity: number;
}

function PartPage() {
  const navigate = useNavigate();
  const { id: rentableId } = useParams();
  const location = useLocation();
  const [parts, setParts] = useState<Part[]>([]);
  const [originalParts, setOriginalParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const state = location.state as any;

    if (state?.parts) {
      const loadedParts = state.parts;
      setParts(loadedParts);
      setOriginalParts(JSON.parse(JSON.stringify(loadedParts)));
      setLoading(false);
    } else if (rentableId) {
      fetch(`${API_URL}/api/inventory/rentable/${rentableId}`)
        .then((res) => res.json())
        .then((data) => {
          const loadedParts = data.parts || [];
          setParts(loadedParts);
          setOriginalParts(JSON.parse(JSON.stringify(loadedParts)));
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch rentable parts:", err);
          setLoading(false);
        });
    }

    // Handle newly added part from AddPartPage
    if (state?.addedPart) {
      setParts((prev) => [...prev, state.addedPart]);
      setOriginalParts((prev) => [...prev, state.addedPart]);
      navigate(location.pathname, { replace: true }); // clear state
    }
  }, [rentableId, location.state]);

  const handleChange = (index: number, field: keyof Part, value: any) => {
    const updated = [...parts];
    updated[index] = { ...updated[index], [field]: value };
    setParts(updated);
  };

  const handleDeletePart = async (index: number) => {
    const part = parts[index];

    if (!window.confirm(`Are you sure you want to delete "${part.name || "this part"}"?`)) {
      return;
    }

    if (!part.id) {
      setParts(parts.filter((_, i) => i !== index));
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/inventory/rentable/part/${part.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`Failed to delete part ${part.id}`);

      setParts(parts.filter((_, i) => i !== index));
      alert("Part deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete part");
    }
  };

  const handleSave = async () => {
    if (!rentableId) return;

    try {
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];

        if (p.id) {
          const original = originalParts.find(op => op.id === p.id);
          if (!original) continue;

          const payload: any = { id: p.id };
          let changed = false;

          if (p.name !== original.name) {
            payload.name = p.name || null;
            changed = true;
          }
          if (p.description !== original.description) {
            payload.description = p.description || null;
            changed = true;
          }
          if (p.quantity !== original.quantity) {
            payload.quantity = p.quantity;
            changed = true;
          }

          if (!changed) continue;

          const res = await fetch(`${API_URL}/api/inventory/rentable/part/${p.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) throw new Error(`Failed to update part ${p.id}`);
        }
      }

      alert("Parts saved successfully");
      navigate(-1);
    } catch (err) {
      console.error("Failed to save parts —", err);
      alert("Failed to save parts");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="parts-wrapper">
      <h1>Manage Parts</h1>
      <table className="reusable-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={part.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={part.description || ""}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  value={part.quantity}
                  onChange={(e) =>
                    handleChange(index, "quantity", parseInt(e.target.value) || 0)
                  }
                />
              </td>
              <td>
                <div className="partpage-buttons">
                    <button className="delete-btn" onClick={() => handleDeletePart(index)}>
                    Delete
                    </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="parts-buttons">
        <button
          className="add-btn"
          onClick={() => navigate(`/rentable/${rentableId}/add-part`)}
        >
          Add Part
        </button>
        <button className="save-btn" onClick={handleSave}>
        Save Changes
        </button>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}

export default PartPage;
