import { useEffect } from "react";
import fetchData from "../../services/Api";

function TestFetchRentables() {
  useEffect(() => {
    async function getRentables() {
      try {
        const rentables = await fetchData("inventory/rentable");
        console.log("All rentables:", rentables);
      } catch (error) {
        console.error("Error fetching rentables:", error);
      }
    }

    getRentables();
  }, []);

  return <div>Check the console for rentables data</div>;
}

export default TestFetchRentables;
