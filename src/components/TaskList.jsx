import { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import AddTaskForm from "./AddTaskForm";
import FocusTimer from "./FocusTimer";
import {
  fetchTasks,
  createTask,
  setTaskCompleted,
  deleteTask,
} from "../lib/tasksApi";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

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