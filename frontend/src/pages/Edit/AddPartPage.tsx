import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import "./PartPage.css"

const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_DEV_URL;

function AddPartPage() {
  const navigate = useNavigate();
  const { id: rentableId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAddPart = async () => {
    if (!name) return alert("Name is required");
    setLoading(true);

    const payload = {
      name,
      description: description || null,
      quantity,
      rentable_id: rentableId,
      availability: null,
    };

    try {
      const res = await fetch(`${API_URL}/api/inventory/rentable/part`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const newPart = await res.json();

      // Navigate back to PartPage and pass new part in state
      navigate(`/rentable/${rentableId}/parts`, { state: { addedPart: newPart } });
    } catch (err: any) {
      console.error("Add part failed:", err);
      alert("Add part failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-part-wrapper">
      <h1>Add Part</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        min={0}
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
      />
      <button onClick={handleAddPart} disabled={loading}>
        {loading ? "Adding..." : "Add Part"}
      </button>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default AddPartPage;
