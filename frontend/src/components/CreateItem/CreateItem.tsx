import { useState } from "react";
import sendData from "../../services/sendData";
import fetchData from "../../services/Api";
import "./CreateItem.css";
import Button from "../Button/Button";

export default function CreateItem() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createdItem, setCreatedItem] = useState<{ name: string; description: string | null } | null>(null);

  const handleSubmit = async () => {
    // Validate name length
    if (!name.trim()) {
      alert("Name is required.");
      return;
    }
    if (name.length > 32) {
      alert("Name cannot exceed 32 characters.");
      return;
    }
    if (description.length > 255) {
      alert("Description cannot exceed 255 characters.");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || null, // conform to nullable
    };

    try {
      const result = await sendData("inventory/item", "POST", payload);

      if (!result) {
        alert("Failed to create item.");
        return;
      }

      alert("Item created successfully!");

      // Fetch full item details
      try {
        const itemDetails = await fetchData(`inventory/item/${result.id}`);
        if (itemDetails) {
          setCreatedItem({
            name: itemDetails.name,
            description: itemDetails.description,
          });
        }
      } catch (err) {
        console.error("Error fetching created item:", err);
        setCreatedItem({
          name: payload.name,
          description: payload.description,
        });
      }

      // Reset form fields
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Error creating item:", err);
      alert("Failed to create item due to server error.");
    }
  };

  return (
    <div className="createitem-wrapper">
      <h2>Create New Item</h2>

      <label>Name:</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter item name"
      />

      <label>Description:</label>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter description (optional)"
      />

      <Button variant="primary" label="Submit Item" onClick={handleSubmit} />

      {createdItem && (
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc" }}>
          <h3>Created Item Details:</h3>
          <p><strong>Name:</strong> {createdItem.name}</p>
          <p><strong>Description:</strong> {createdItem.description || "None"}</p>
        </div>
      )}
    </div>
  );
}
