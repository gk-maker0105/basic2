import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!form.email || !form.password) {
      setMsg("Email and password are required");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.msg || "Error");
        return;
      }
      // Save token + user and go to dashboard
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch {
      setMsg("Network error");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
        /><br/><br/>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
        /><br/><br/>
        <button>Login</button>
      </form>
      <p style={{ color: "crimson" }}>{msg}</p>
      <p><a href="/signup">Create account</a></p>
    </div>
  );
}
