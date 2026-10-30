// The single place that defines the rules for a task.
// The Supabase table will use these same values later.

export const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const DEFAULT_PRIORITY = "medium";

export const STATUSES = ["todo", "in_progress", "done"];
export const DEFAULT_STATUS = "todo";

export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;