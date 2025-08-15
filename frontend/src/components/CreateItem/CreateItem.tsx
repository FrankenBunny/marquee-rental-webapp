import { useState } from "react";
import "./CreateItem.css";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_DEV_URL;

export default function CreateItem() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hasParts, setHasParts] = useState(false);
  const [total, setTotal] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  const [broken, setBroken] = useState(0);
  const [parts, setParts] = useState<any[]>([]);
  const [newPart, setNewPart] = useState({
    name: "",
    description: "",
    quantity: 0,
    availability: { total: 0, maintenance: 0, broken: 0 },
  });

  const handleAddPart = () => {
    if (!newPart.name || newPart.quantity <= 0) {
      alert("Part must have a name and quantity greater than 0.");
      return;
    }

    setParts((prev) => [
      ...prev,
      {
        ...newPart,
        availability: { total: newPart.quantity, maintenance: 0, broken: 0 },
      },
    ]);

    setNewPart({ name: "", description: "", quantity: 0, availability: { total: 0, maintenance: 0, broken: 0 } });
  };

  const handleRemovePart = (index: number) => {
    setParts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (broken + maintenance > total) {
      alert("The sum of broken and maintenance items cannot exceed total.");
      return;
    }

    if (hasParts && parts.length === 0) {
      alert("If 'Has Parts' is checked, you must add at least one part.");
      return;
    }

    const payload: any = {
      name,
      description,
      has_parts: hasParts,
      availability: { total, maintenance, broken },
      parts: hasParts ? parts : [],
    };

    console.log("Submitting payload:", payload);

    try {
      const response = await fetch(`${API_URL}/api/inventory/rentable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      navigate(`/view/${result.id}`);
    } catch (err) {
      console.error("Failed to create rentable:", err);
    }
  };

  return (
    <div className="createitem-wrapper">
      <h2>Create New Rentable</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter item name"
          required
        />

        <label>Description:</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />

        <label>Total:</label>
        <input
          type="number"
          value={total}
          onChange={(e) =>
            setTotal(e.target.value === "" ? 0 : Number(e.target.value))
          }
          min="0"
        />

        <label>Maintenance:</label>
        <input
          type="number"
          value={maintenance}
          onChange={(e) =>
            setMaintenance(e.target.value === "" ? 0 : Number(e.target.value))
          }
          min="0"
        />

        <label>Broken:</label>
        <input
          type="number"
          value={broken}
          onChange={(e) =>
            setBroken(e.target.value === "" ? 0 : Number(e.target.value))
          }
          min="0"
        />

        <label>
          <input
            type="checkbox"
            checked={hasParts}
            onChange={(e) => setHasParts(e.target.checked)}
          />
          Has Parts
        </label>

        {hasParts && (
          <div className="parts-section">
            <h3>Add Part</h3>
            <input
              type="text"
              placeholder="Part name"
              value={newPart.name}
              onChange={(e) =>
                setNewPart({ ...newPart, name: e.target.value })
              }
            />

            {newPart.name.trim() !== "" && (
              <>
                <input
                  type="text"
                  placeholder="Part description"
                  value={newPart.description}
                  onChange={(e) =>
                    setNewPart({ ...newPart, description: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newPart.quantity === 0 ? "" : newPart.quantity}
                  onChange={(e) =>
                    setNewPart({
                      ...newPart,
                      quantity:
                        e.target.value === "" ? 0 : Number(e.target.value),
                    })
                  }
                  min="1"
                />
                <Button
                  variant="primary"
                  label="Add Part"
                  onClick={handleAddPart}
                />
              </>
            )}

            <ul>
              {parts.map((part, index) => (
                <li key={index}>
                  {part.name} – {part.quantity} pcs
                  <button
                    type="button"
                    onClick={() => handleRemovePart(index)}
                    style={{
                      marginLeft: "0.5rem",
                      color: "red",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="button-wrapper">
          <Button variant="primary" label="Submit Item" />
        </div>
      </form>
    </div>
  );
}
