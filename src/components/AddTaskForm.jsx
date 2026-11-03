import { useState } from "react";
import {
  PRIORITIES,
  DEFAULT_PRIORITY,
  TITLE_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
} from "../constants/taskFields";

function AddTaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(DEFAULT_PRIORITY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [remindAt, setRemindAt] = useState("");

  function validate() {
    const newErrors = {};
    const cleanTitle = title.trim();

    if (cleanTitle === "") {
      newErrors.title = "Please enter a task title.";
    } else if (cleanTitle.length > TITLE_MAX_LENGTH) {
      newErrors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`;
    }

    if (description.trim().length > DESCRIPTION_MAX_LENGTH) {
      newErrors.description = `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`;
    }

    if (remindAt && new Date(remindAt).getTime() <= Date.now()) {
      newErrors.remindAt = "Pick a reminder time in the future.";
    }

    return newErrors;
  }

    async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (
      remindAt &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }

    setSubmitting(true);
    const saved = await onAddTask({
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate || null,
      priority,
      remind_at: remindAt ? new Date(remindAt).toISOString() : null,
    });
    setSubmitting(false);

    if (!saved) return; // keep the text so you can retry

    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority(DEFAULT_PRIORITY);
    setErrors({});
    setRemindAt("");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2>Add a task</h2>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p role="alert" className="error">{errors.title}</p>}
      </div>

      <div className="field">
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p role="alert" className="error">{errors.description}</p>}
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="dueDate">Due date (optional)</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="remindAt">Remind me (optional)</label>
        <input
          id="remindAt"
          type="datetime-local"
          value={remindAt}
          onChange={(e) => setRemindAt(e.target.value)}
        />
        {errors.remindAt && <p role="alert" className="error">{errors.remindAt}</p>}
      </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Saving…" : "Add task"}
      </button>
    </form>
  );
}

export default AddTaskForm;