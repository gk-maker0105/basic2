import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // fetch user profile
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          // token invalid/expired: log out
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        const data = await res.json();
        setMe(data);
      })
      .catch(() => setMsg("Network error"));
  }, [navigate]);

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      {me ? (
        <>
          <p>Welcome, <b>{me.name}</b> ({me.email})</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>{msg || "Loading..."}</p>
      )}
    </div>
  );
}
