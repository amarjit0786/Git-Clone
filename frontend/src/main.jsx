import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import ProjectRoutes from "./Routes.jsx";
import { BrowserRouter as Routes } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Routes>
      <ProjectRoutes />
    </Routes>
  </AuthProvider>
);
