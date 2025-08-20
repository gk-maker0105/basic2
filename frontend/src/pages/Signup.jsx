import { useState } from "react";

const API_BASE = "http://localhost:5000/api"; // backend base URL

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!form.name || !form.email || !form.password) {
      setMsg("All fields are required");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.msg || "Error");
        return;
      }
      setMsg("Registered! You can login now.");
      setForm({ name: "", email: "", password: "" });
    } catch {
      setMsg("Network error");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Sign Up</h2>
      <form onSubmit={onSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
        /><br/><br/>
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
        <button>Create Account</button>
      </form>
      <p style={{ color: msg?.includes("Registered") ? "green" : "crimson" }}>{msg}</p>
      <p><a href="/login">Go to Login</a></p>
    </div>
  );
}
