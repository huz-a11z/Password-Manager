import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Homepage</h1>
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Login
      </button>
      <button
        onClick={() => navigate("/signup")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sign Up
      </button>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
