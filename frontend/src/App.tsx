import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import RegisterPage from "./components/RegisterPage";
import SimulationsPage from "./components/UserSimulations";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/simulations" element={<SimulationsPage />} />
    </Routes>
  );
};

export default App;
