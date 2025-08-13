import { useState } from "react";
import sendData from "../../services/sendData";
import "./CreateItem.css";
import Button from "../Button/Button";

export default function CreateItem() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("");

  const handleSubmit = async () => {
    // Only send fields your backend expects
    const payload = {
      name,
      description
    };

    const result = await sendData("inventory/item", "POST", payload);
    if (result) {
      alert("Item created successfully!");
      // Reset form fields
      setName("");
      setDescription("");
      setQuantity(1);
      setCategory("");
    } else {
      alert("Failed to create item.");
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
        placeholder="Enter description"
      />

      {/* These fields are not sent yet, but kept in the form */}
      <label>Quantity:</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min="1"
      />

      <label>Category:</label>
      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter category"
      />

      <Button variant="primary" label="Submit Item" onClick={handleSubmit} />
    </div>
  );
}
