const API_URL = import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_API_URL
  : import.meta.env.VITE_API_DEV_URL;

async function sendData(endpoint = '', method = 'POST', payload: unknown = {}) {
  if (!endpoint) {
    console.error("sendData: Endpoint is undefined.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Failed to send data to backend at /api/${endpoint}:`, err);
  }
}

export default sendData;
