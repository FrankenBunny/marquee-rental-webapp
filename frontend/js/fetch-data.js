const API_URL = window.env.API_URL;

async function fetchData(endpoint = '') {
  try {
    console.log(`${API_URL}/api/${endpoint}`);
    const response = await fetch(`${API_URL}/api/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    console.log('Data from backend:', data);
    return data;
  } catch (err) {
    console.error(`Failed to fetch data from backend at /api/${endpoint}:`, err);
  }
};
