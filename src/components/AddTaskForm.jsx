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

    return newErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    // If there is any error, stop here and do not add the task
    if (Object.keys(newErrors).length > 0) return;

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate || null,
      priority,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority(DEFAULT_PRIORITY);
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Add a task</h2>

      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p role="alert" style={{ color: "crimson" }}>{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p role="alert" style={{ color: "crimson" }}>{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="dueDate">Due date (optional)</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Add task</button>
    </form>
  );
}

export default AddTaskForm;