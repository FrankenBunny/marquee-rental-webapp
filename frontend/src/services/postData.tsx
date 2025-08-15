// services/Api.ts
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8888/api";

export default async function postData(endpoint: string, data: Record<string, unknown>) {
  try {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to post data:", err);
    throw err;
  }
}
