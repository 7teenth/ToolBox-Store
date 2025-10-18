import React, { useState, useEffect } from "react";

const PASSWORD = "admin123"; // 🔒 Можна винести у .env

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
      alert("❌ Невірний пароль!");
      setPassword("");
    }
  };

  if (!mounted) return null;

  if (authenticated) return <>{children}</>;

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col gap-6 w-80 border border-gray-100 transition-all"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 text-center tracking-tight">
          🔐 Вхід до адмін панелі
        </h2>

        <div className="flex flex-col gap-2">
          <label className="text-gray-600 font-medium">Пароль</label>
          <input
            type="password"
            placeholder="Введіть пароль"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          Увійти
        </button>

        <p className="text-center text-sm text-gray-500 mt-1">
          © {new Date().getFullYear()} Razor Admin
        </p>
      </form>
    </div>
  );
};
