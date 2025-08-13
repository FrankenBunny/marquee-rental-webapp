import { useState } from "react";
import { useNavigate } from "react-router-dom";
import sendData from "../../services/sendData";

function CreateRentablePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [total, setTotal] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  const [broken, setBroken] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newRentable = {
      name,
      description: description || null,
      availability: {
        total,
        maintenance,
        broken,
      },
    };

    try {
      await sendData("/inventory/rentable", "POST", newRentable);
      navigate("/rentables"); // redirect to RentablesTable page
    } catch (error) {
      console.error("Failed to create rentable:", error);
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <h2>Create Rentable</h2>
      <form onSubmit={handleSubmit} className="create-form">
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Total:
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
            required
          />
        </label>

        <label>
          Maintenance:
          <input
            type="number"
            value={maintenance}
            onChange={(e) => setMaintenance(Number(e.target.value))}
            required
          />
        </label>

        <label>
          Broken:
          <input
            type="number"
            value={broken}
            onChange={(e) => setBroken(Number(e.target.value))}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Rentable"}
        </button>
      </form>
    </div>
  );
}

export default CreateRentablePage;
