import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon, Bell } from "lucide-react";
import avatar from "../assets/profile.png";
export default function Navbar() {
  const navigate = useNavigate();

  // ⚡️ État mode clair/sombre
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Nombre de notifications (mock pour l’instant)
  const [notifications, setNotifications] = useState(3);

  // Appliquer le mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Déconnexion avec confirmation
  const handleLogout = () => {
    const confirmed = window.confirm("🔒 Voulez-vous vraiment vous déconnecter ?");
    if (confirmed) {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <nav
      className={`px-6 py-4 flex justify-between items-center shadow-lg
        ${darkMode ? "bg-slate-800 text-white" : "bg-white text-black"}`}
    >
      {/* LOGO */}
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/chat")}
      >
        💬 MyChatApp
      </div>

      <div className="flex items-center gap-4">
        {/* Navigation */}
        <button
          className={`hover:underline ${darkMode ? "text-white" : "text-black"}`}
          onClick={() => navigate("/chat")}
        >
          Chat
        </button>

        <button
          className={`hover:underline ${darkMode ? "text-white" : "text-black"}`}
          onClick={() => navigate("/add")}
        >
          Ajouter des amis
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifications(0);
              navigate("/chat");
            }}
            className={`p-2 rounded-full hover:bg-slate-300 transition
              ${darkMode ? "hover:bg-slate-700 text-white" : "hover:bg-gray-200 text-black"}`}
          >
            <Bell size={20} />
          </button>

          {notifications > 0 && (
            <span
              className={`absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-xs
                ${darkMode ? "bg-red-500 text-white" : "bg-red-500 text-white"}`}
            >
              {notifications}
            </span>
          )}
        </div>

        {/* Mode clair / sombre */}
        <button
          className={`p-2 rounded-full hover:bg-slate-300 transition
            ${darkMode ? "hover:bg-slate-700 text-white" : "hover:bg-gray-200 text-black"}`}
          onClick={toggleTheme}
          title={darkMode ? "Mode clair" : "Mode sombre"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Profil */}
        <img
          src={avatar}
          alt="Profil"
          className={`w-8 h-8 rounded-full cursor-pointer hover:ring-2
            ${darkMode ? "hover:ring-indigo-500" : "hover:ring-indigo-600"}`}
          onClick={() => navigate("/profil")}
        />

        {/* Déconnexion */}
        <button
          className={`hover:underline ${darkMode ? "text-white" : "text-black"}`}
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
