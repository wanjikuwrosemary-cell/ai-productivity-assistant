import { supabase } from "./supabaseClient";

export async function logFocusSession({ taskId, technique, minutes }) {
  const { error } = await supabase.from("focus_sessions").insert({
    task_id: taskId,
    technique,
    minutes: Math.max(1, Math.round(minutes)),
  });
  if (error) throw error;
}