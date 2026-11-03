import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function AuthForm() {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!email.trim()) return setError("Please enter your email.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");

    setBusy(true);
    const credentials = { email: email.trim(), password };

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp(credentials);
      if (error) setError(error.message);
      else if (!data.session) {
        setNotice("Account created. Check your email to confirm it, then sign in.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword(credentials);
      if (error) setError("Sign in failed. Check your email and password.");
    }
    setBusy(false);
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h1>AI Productivity Assistant</h1>
      <p className="subtitle">
        {mode === "signin" ? "Sign in to your tasks." : "Create your account."}
      </p>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p role="alert" className="error">{error}</p>}
      {notice && <p role="status" className="status">{notice}</p>}

      <button type="submit" className="btn-primary" disabled={busy}>
        {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
      </button>

      <button
        type="button"
        className="btn-text"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setError("");
          setNotice("");
        }}
      >
        {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
      </button>
    </form>
  );
}

export default AuthForm;