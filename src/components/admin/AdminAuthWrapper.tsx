import React, { useState, useEffect } from "react";

const PASSWORD = "admin123"; // можно заменить на env

export const AdminAuthWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin-auth");
    if (saved === "true") setAuthenticated(true);
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem("admin-auth", "true");
    } else {
      alert("Incorrect password!");
      setPassword("");
    }
  };

  if (!mounted) return null;

  if (authenticated) return <>{children}</>;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md flex flex-col gap-4 w-80"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Admin Login
        </h2>
        <input
          type="password"
          placeholder="Enter password"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
};
