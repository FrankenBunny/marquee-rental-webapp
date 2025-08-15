import CreateItem from "../../components/CreateItem/CreateItem";
import "./CreateRentablePage.css";

export default function CreateRentablePage() {
  return (
    <div className="page-wrapper">
      <CreateItem />
    </div>
  );
}


/*import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateRentablePage.css";
import Button from "../../components/Button/Button";

const API_URL = import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_API_URL
  : import.meta.env.VITE_API_DEV_URL;

export default function CreateRentablePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hasParts, setHasParts] = useState(false);

  const [total, setTotal] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  const [broken, setBroken] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      description,
      has_parts: hasParts,
      has_extensions: false,
      availability: {
        total: Number(total),
        maintenance: Number(maintenance),
        broken: Number(broken),
      },
      parts: [],
    };

    console.log("Submitting payload:", payload);

    try {
      const response = await fetch(`${API_URL}/api/inventory/rentable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();
      navigate(`/view/${result.id}`);
    } catch (err) {
      console.error("Failed to create rentable:", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Rentable</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="font-semibold">Has Parts</label>
          <input
            type="checkbox"
            checked={hasParts}
            onChange={(e) => setHasParts(e.target.checked)}
          />
        </div>

        <h2 className="text-lg font-semibold mt-4">Availability</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block">Total</label>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full"
              min={0}
            />
          </div>
          <div>
            <label className="block">Maintenance</label>
            <input
              type="number"
              value={maintenance}
              onChange={(e) => setMaintenance(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full"
              min={0}
            />
          </div>
          <div>
            <label className="block">Broken</label>
            <input
              type="number"
              value={broken}
              onChange={(e) => setBroken(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full"
              min={0}
            />
          </div>
        </div>

        <Button variant="primary" label="Submit Rentable" onClick={handleSubmit} />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded mt-4 hover:bg-blue-700"
        >
          Submit Changes
        </button>
        
      </form>
    </div>
  );
}
*/