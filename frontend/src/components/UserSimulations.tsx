import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../url";

const SimulationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSimulationIndex, setCurrentSimulationIndex] = useState<number>(0);

  useEffect(() => {
    const fetchSimulations = async (): Promise<void> => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await fetch(url + "/user/jsons", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
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

  const nextSimulation = (): void => {
    if (currentSimulationIndex < simulations.length - 1) {
      setCurrentSimulationIndex(currentSimulationIndex + 1);
    }
  };

  const prevSimulation = (): void => {
    if (currentSimulationIndex > 0) {
      setCurrentSimulationIndex(currentSimulationIndex - 1);
    }
  };

  const currentSimulation = simulations[currentSimulationIndex];

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
      ) : simulations.length === 0 ? (
        <p>No simulations available</p>
      ) : (
        <div>
          {/* Navigation Arrows - Moved above the table */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevSimulation}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              disabled={currentSimulationIndex === 0}
            >
              &lt; Previous
            </button>
            <h2 className="text-2xl">Simulation {currentSimulationIndex + 1} of {simulations.length}</h2>
            <button
              onClick={nextSimulation}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              disabled={currentSimulationIndex === simulations.length - 1}
            >
              Next &gt;
            </button>
          </div>

          {/* Display current simulation */}
          <div className="border-2 border-gray-800 p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Input */}
              <div className="border-2 border-gray-800 p-4">
                <h3 className="text-xl mb-2">Input</h3>
                <pre>{JSON.stringify(currentSimulation.input, null, 2)}</pre>
              </div>

              {/* Output */}
              <div className="border-2 border-gray-800 p-4">
                <h3 className="text-xl mb-2">Output</h3>
                <pre>{JSON.stringify(currentSimulation.output, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationsPage;
