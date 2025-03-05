import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../url";

const SimulationsPage: React.FC = () => {
  const navigate = useNavigate(); 
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSimulations = async (): Promise<void> => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await fetch(url + "/user/jsons", {
          method: "GET",
          headers: {
            "Authorization": token!,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch simulations");
        }

        const result = await response.json();
        setSimulations(result.jsons);
      } catch (error) {
        console.error("Error fetching simulations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulations();
  }, []);

  const handleGoBack = (): void => {
    navigate("/main");
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl mb-4">My Simulations</h1>
        <button
          onClick={handleGoBack}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Back to Main Page
        </button>
      </div>
      {loading ? (
        <p>Loading simulations...</p>
      ) : (
        <table className="min-w-full table-auto border-2 border-gray-800">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left border-2 border-gray-800">Input</th>
              <th className="px-6 py-3 text-left border-2 border-gray-800">Output</th>
            </tr>
          </thead>
          <tbody>
            {simulations.map((simulation, index) => (
              <tr key={index}>
                <td className="border-2 border-gray-800 px-6 py-3">
                  <pre>{JSON.stringify(simulation.input, null, 2)}</pre>
                </td>

                <td className="border-2 border-gray-800 px-6 py-3 align-top">
                  <div className="mb-4">
                    <pre>{JSON.stringify(simulation.output, null, 2)}</pre>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SimulationsPage;
