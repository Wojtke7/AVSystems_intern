import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../url";

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [fileContent, setFileContent] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/json") {
      setSimulationResult(null);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setFileContent(JSON.parse(e.target?.result as string));
      reader.readAsText(file);
    }
  };

  const runSimulation = async (): Promise<void> => {
    if (!fileContent) return;

    const token = localStorage.getItem("token");
    const { commands } = fileContent;

    try {
      const response = await fetch(url + "/user/json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token!,
        },
        body: JSON.stringify({
          fileName,
          commands,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to run simulation");
      }

      const result = await response.json();
      setSimulationResult(result.simulation);
    } catch (error) {
      console.error("Error running simulation:", error);
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navigateToSimulations = (): void => {
    navigate("/simulations");
  };

  if (!localStorage.getItem("token")) {
    navigate("/");
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl">Run Your Simulation</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <input type="file" accept=".json" onChange={handleFileUpload} className="mb-4" />
      <button className="bg-green-500 text-white p-2 ml-4" onClick={runSimulation}>
        Run Simulation
      </button>
      <button
        onClick={navigateToSimulations}
        className="bg-blue-500 text-white py-2 px-4 rounded ml-4 hover:bg-blue-600"
      >
        My Simulations
      </button>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <pre className="border p-4">
          {fileContent ? JSON.stringify(fileContent, null, 2) : "Upload a JSON file"}
        </pre>
        <pre className="border p-4">
          {simulationResult ? JSON.stringify(simulationResult, null, 2) : "Simulation result will appear here"}
        </pre>
      </div>
    </div>
  );
};

export default MainPage;
