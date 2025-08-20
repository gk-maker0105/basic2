import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Align from "./pages/Align";
import History from "./pages/History";


const isAuthed = () => !!localStorage.getItem("token");

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 12, padding: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/align">Align</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/history">History</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={isAuthed() ? <Dashboard /> : <Login />} />
        <Route path="/align" element={isAuthed() ? <Align /> : <Login />} />
        <Route path="/history" element={isAuthed() ? <History /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
}
