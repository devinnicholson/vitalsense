import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function Layout({ children }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <header className="flex justify-between items-center p-4 shadow-sm dark:shadow-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          VitalSense
        </h1>
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded focus:outline-none bg-gray-200 dark:bg-gray-700">
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
