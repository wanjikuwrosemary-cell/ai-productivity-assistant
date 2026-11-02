import { useEffect } from "react";
import TaskList from "./components/TaskList";
import { supabase } from "./lib/supabaseClient";

function App() {
  // TEMPORARY: connection test, we will remove this
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from("tasks").select("*");
      console.log("data:", data, "error:", error);
    }
    testConnection();
  }, []);

  return <TaskList />;
}

export default App;