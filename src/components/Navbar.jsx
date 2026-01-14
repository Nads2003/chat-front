import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon, Bell, Menu, X } from "lucide-react";
import avatar from "../assets/profile.png";

export default function Navbar() {
  const navigate = useNavigate();

  // ⚡️ Mode sombre / clair
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Menu mobile
  const [mobileOpen, setMobileOpen] = useState(false);

  // Notifications mock
  const [notifications, setNotifications] = useState(3);

  // Appliquer mode
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
  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    const confirmed = window.confirm("🔒 Voulez-vous vraiment vous déconnecter ?");
    if (confirmed) {
      localStorage.clear();
      navigate("/");
    }
  };

  // Liens de navigation
  const navLinks = [
    { name: "Chat", path: "/chat" },
    { name: "Amis", path: "/add" },
  ];

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

      {/* Menu Desktop */}
      <div className="hidden md:flex items-center gap-4">
        {navLinks.map(link => (
          <button
            key={link.name}
            className={`hover:underline ${darkMode ? "text-white" : "text-black"}`}
            onClick={() => navigate(link.path)}
          >
            {link.name}
          </button>
        ))}

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
                bg-red-500 text-white`}
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

      {/* Menu Mobile Hamburger */}
      <div className="md:hidden flex items-center gap-2">
        <button
          className={`p-2 rounded-full hover:bg-slate-300 transition
            ${darkMode ? "hover:bg-slate-700 text-white" : "hover:bg-gray-200 text-black"}`}
          onClick={toggleTheme}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button onClick={toggleMobileMenu}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Mobile Dropdown */}
      {mobileOpen && (
        <div className={`absolute top-16 left-0 w-full bg-white dark:bg-slate-800 shadow-md flex flex-col p-4 md:hidden z-50`}>
          {navLinks.map(link => (
            <button
              key={link.name}
              className={`py-2 text-left hover:underline ${darkMode ? "text-white" : "text-black"}`}
              onClick={() => {
                navigate(link.path);
                setMobileOpen(false);
              }}
            >
              {link.name}
            </button>
          ))}
          <button
            className={`py-2 text-left hover:underline ${darkMode ? "text-white" : "text-black"}`}
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        </div>
      )}
    </nav>
  );
}
