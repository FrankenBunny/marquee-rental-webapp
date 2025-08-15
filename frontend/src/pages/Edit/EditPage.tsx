import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditPage.css";

const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_DEV_URL;

function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rentable, setRentable] = useState<Record<string, any> | null>(null);
  const [formData, setFormData] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch rentable data
  useEffect(() => {
    if (!id) return;
    const fetchRentable = async () => {
      try {
        const res = await fetch(`${API_URL}/api/inventory/rentable/${id}`);
        if (!res.ok) throw new Error("Failed to fetch rentable");
        const data = await res.json();
        setRentable(data);
        setFormData({ name: data.name, description: data.description });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load rentable");
      }
    };
    fetchRentable();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!rentable) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/inventory/rentable/${rentable.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rentable.id, ...formData }),
      });
      if (!res.ok) throw new Error("Failed to update rentable");
      const updated = await res.json();
      setRentable(updated);
      alert("Rentable updated!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update rentable");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!rentable) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this rentable and all its parts?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/inventory/rentable/${rentable.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete rentable");
      alert("Rentable deleted!");
      navigate("/"); // redirect to rentable list
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete rentable");
    } finally {
      setLoading(false);
    }
  };

  const goToPartsPage = () => {
    if (!rentable) return;
    navigate(`/rentable/${rentable.id}/parts`, { state: { parts: rentable.parts } });
  };

  const renderPartsTable = () => {
    if (!rentable?.parts || rentable.parts.length === 0) return <p>No parts</p>;
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
          {rentable.parts.map((part: any, idx: number) => (
            <tr key={idx}>
              <td>{part.name}</td>
              <td>{part.description || ""}</td>
              <td>{part.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (!rentable) {
    return (
      <div className="editpage-wrapper">
        <div className="editpage-container">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="editpage-wrapper">
      <div className="editpage-container">
        <h1>Edit Rentable</h1>
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <h2>Parts</h2>
        {renderPartsTable()}
        <button onClick={goToPartsPage} className="edit-parts-btn">
          Edit Parts
        </button>

        {error && <p className="error-msg">{error}</p>}

        <div className="button-group">
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={() => navigate(-1)}>Back</button>
          <button onClick={handleDelete} disabled={loading} className="delete-btn">
            {loading ? "Processing..." : "Delete Rentable"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
