const API_URL = import.meta.env.VITE_API_DEV_URL;

async function fetchData(endpoint = '') {
    if (!endpoint) {
        console.error("fetchData: Endpoint is undefined.");
        return;
    }
    
    try {
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
        return data;
    } catch (err) {
        console.error(`Failed to fetch data from backend at /api/${endpoint}:`, err);
    }
}

export default fetchData