import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { url } from "../url";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLogin = async (): Promise<void> => {
    try {
      const response = await fetch(url + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); 
        navigate("/main");
      } else {
        setErrorMessage(data.message || "An error occurred during login.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while trying to log in.");
      console.error("Login error:", error);
    }
  };

  const handleRegister = (): void => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">Traffic Light Simulator</h1>
        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">
            <p>{errorMessage}</p>
          </div>
        )}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-200"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
