import "../App.css";

export default function Login({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img
          src="/assets/reliance-logo.png"
          alt="Reliance Logo"
          className="login-logo"
        />
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to access RCPL Dashboard Portal</p>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={handleLogin}>Login</button>

        
      </div>
    </div>
  );
}