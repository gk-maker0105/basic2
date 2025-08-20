export default function Home() {
  const isAuthed = !!localStorage.getItem("token");

  return (
    <div style={{ padding: 20 }}>
      <h2>Home</h2>
      <p>Welcome! This is a tiny demo with Sign Up, Login, and a protected Dashboard.</p>
      {!isAuthed ? (
        <p>Start by creating an account on the <a href="/signup">Sign Up</a> page.</p>
      ) : (
        <p>You are logged in. Go to <a href="/dashboard">Dashboard</a>.</p>
      )}
    </div>
  );
}
