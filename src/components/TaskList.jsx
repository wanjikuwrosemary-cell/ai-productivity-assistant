import { useEffect,useRef, useState } from "react";
import TaskItem from "./TaskItem";
import AddTaskForm from "./AddTaskForm";
import FocusTimer from "./FocusTimer";
import { supabase } from "../lib/supabaseClient";

import {
  fetchTasks,
  createTask,
  setTaskCompleted,
  deleteTask,
  markReminderSent
} from "../lib/tasksApi";

function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [dueReminders, setDueReminders] = useState([]);
  const firedRef = useRef(new Set());

  // Load tasks once when the page opens
  useEffect(() => {
    let cancelled = false;
    fetchTasks()
      .then((data) => {
        if (!cancelled) setTasks(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

    // Check for due reminders every 10 seconds while the app is open
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      tasks.forEach((task) => {
        if (task.completed || task.reminder_sent || !task.remind_at) return;
        if (firedRef.current.has(task.id)) return;
        if (new Date(task.remind_at).getTime() > now) return;

        firedRef.current.add(task.id);
        setDueReminders((prev) => [...prev, task]);

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Reminder", { body: task.title });
        }

        markReminderSent(task.id)
          .then((updated) =>
            setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
          )
          .catch(() => {});
      });
    }, 10000);
    return () => clearInterval(id);
  }, [tasks]);

  // Returns true if saved, so the form knows whether to clear itself
  async function handleAddTask(newTask) {
    try {
      const created = await createTask(newTask);
      setTasks((prev) => [created, ...prev]);
      setActionError("");
      return true;
    } catch (err) {
      setActionError(`Could not save the task: ${err.message}`);
      return false;
    }
  }

  async function handleToggle(task) {
    try {
      const updated = await setTaskCompleted(task.id, !task.completed);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setActionError("");
    } catch (err) {
      setActionError(`Could not update the task: ${err.message}`);
    }
  }

  async function handleDelete(task) {
    // You approve destructive actions
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      setActionError("");
    } catch (err) {
      setActionError(`Could not delete the task: ${err.message}`);
    }
  }

  const openTasks = tasks.filter((t) => !t.completed);

  return (
    <div>
      <div className="topbar">
        <span className="task-meta">{user.email}</span>
        <button
          type="button"
          className="btn-text"
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </button>
      </div>
      <h1>My Tasks</h1>
      <p className="subtitle">
        {openTasks.length} open · {tasks.length} total
      </p>

      <FocusTimer tasks={openTasks} />

      <AddTaskForm onAddTask={handleAddTask} />

      {actionError && (
        <p role="alert" className="error">
          {actionError}
        </p>
      )}

      {loading && <p className="status">Loading tasks…</p>}
      {loadError && (
        <p role="alert" className="error">
          Could not load tasks: {loadError}
        </p>
      )}
      {!loading && !loadError && tasks.length === 0 && (
        <p className="status">No tasks yet. Add your first one above.</p>
        
      )}

            {dueReminders.length > 0 && (
        <div className="reminder-banner" role="status">
          {dueReminders.map((t) => (
            <div key={t.id} className="reminder-row">
              <span>Reminder: {t.title}</span>
              <button
                type="button"
                className="btn-text"
                onClick={() =>
                  setDueReminders((prev) => prev.filter((r) => r.id !== t.id))
                }
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}

export default TaskList;