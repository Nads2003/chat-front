import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { User, Lock } from "lucide-react";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
    navigate("/add");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">
      {/* Card gradient */}
      <div className="w-full sm:w-[90%] md:w-[400px] p-[2px] rounded-2xl bg-gradient-to-r from-indigo-500 to-emerald-500 shadow-2xl">
        <form className="bg-slate-900 rounded-2xl p-6 sm:p-8" onSubmit={handleSubmit}>
          {/* Titre */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Connexion</h2>
            <p className="text-slate-400 text-sm mt-1 sm:mt-2">
              Accédez à votre espace personnel
            </p>
          </div>

          {/* Username */}
          <div className="relative mb-4 sm:mb-5">
            <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              className="w-full pl-11 p-3 rounded-xl bg-slate-800 focus:bg-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative mb-5 sm:mb-6">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full pl-11 p-3 rounded-xl bg-slate-800 focus:bg-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Bouton */}
          <button className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-emerald-600 hover:scale-[1.02] transition-transform shadow-lg">
            Se connecter
          </button>

          {/* Lien inscription */}
          <p className="text-center text-sm text-slate-400 mt-4">
            Pas encore de compte ?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-emerald-400 hover:underline cursor-pointer font-medium"
            >
              Créer un compte
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
