import { supabase } from "./supabaseClient";

export async function fetchTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createTask({ title, description, due_date, priority }) {
  const { data, error } = await supabase
    .from("tasks")
    .insert({ title, description, due_date, priority })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setTaskCompleted(id, completed) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ completed, status: completed ? "done" : "todo" })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}