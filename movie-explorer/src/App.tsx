import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./components/Login";
import Register from "./components/Register";
import Explorer from "./Explorer";
import { getCurrentUser } from "./utils/user";
import type { JSX } from "react";

function RequireAuth({ children }: { children: JSX.Element }) {
  const user = getCurrentUser();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

function App() {
  console.log("RequireAuth: currentUser =", localStorage.getItem("currentUser"));
  console.log("RequireAuth: users =", localStorage.getItem("users"));
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/explorer"
          element={
            <RequireAuth>
              <Explorer />
            </RequireAuth>
          }
        />
        <Route
          path="/"
          element={
            <RequireAuth>
              <LandingPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
