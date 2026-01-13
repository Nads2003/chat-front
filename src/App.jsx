import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AuthProvider from "./context/AuthContext";
import Chat from "./pages/Chat";
import PrivateRoute from "./components/PrivateRoute"
import Addfriends from "./pages/Addfriends";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
            {/* 🔐 ROUTE PROTÉGÉE */}
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
           <Route
            path="/add"
            element={
              <PrivateRoute>
                <Addfriends />
              </PrivateRoute>
            }
          />
           <Route
            path="/profil"
            element={
              <PrivateRoute>
                < Profile/>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

