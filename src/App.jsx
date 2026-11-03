import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import AuthForm from "./components/AuthForm";
import TaskList from "./components/TaskList";

function App() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    // Runs whenever someone signs in or out
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checking) return <p className="status">Loading…</p>;
  if (!session) return <AuthForm />;

  // key resets all task state if a different person signs in
  return <TaskList key={session.user.id} user={session.user} />;
}

export default App;