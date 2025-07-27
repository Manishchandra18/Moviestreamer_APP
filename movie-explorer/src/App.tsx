import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./components/Login";
import Register from "./components/Register";
import Explorer from "./Explorer";
import { getCurrentUser } from "./utils/favourites";

function App() {
  const user = getCurrentUser();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explorer" element={user ? <Explorer /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
