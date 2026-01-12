import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await api.post("/auth/inscription/", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      alert("Compte créé avec succès !");
      navigate("/");
    } catch (err) {
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-xl w-96 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Créer un compte
        </h2>

        <input
          name="username"
          placeholder="Nom d'utilisateur"
          className="w-full p-3 mb-4 rounded bg-slate-700 outline-none"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-slate-700 outline-none"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          className="w-full p-3 mb-4 rounded bg-slate-700 outline-none"
          onChange={handleChange}
          required
        />

        <input
          name="confirm"
          type="password"
          placeholder="Confirmer le mot de passe"
          className="w-full p-3 mb-6 rounded bg-slate-700 outline-none"
          onChange={handleChange}
          required
        />

        <button className="w-full bg-emerald-600 hover:bg-emerald-700 p-3 rounded font-semibold">
          S'inscrire
        </button>

        <p className="text-center text-sm mt-4 text-slate-400">
          Déjà un compte ?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-indigo-400 cursor-pointer"
          >
            Se connecter
          </span>
        </p>
      </form>
    </div>
  );
}
