function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as ${task.completed ? "not done" : "done"}`}
      />
      <div className="task-body">
        <div className={`task-title ${task.completed ? "done" : ""}`}>
          {task.title}
        </div>
        {task.due_date && <div className="task-meta">Due {task.due_date}</div>}
      </div>
      <span className={`badge ${task.priority}`}>{task.priority}</span>
      <button
        type="button"
        className="btn-text"
        onClick={() => onDelete(task)}
        aria-label={`Delete "${task.title}"`}
      >
        Delete
      </button>
    </li>
  );
}

export default TaskItem;