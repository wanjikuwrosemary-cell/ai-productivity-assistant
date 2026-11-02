function TaskItem({ task }) {
  return (
    <li className="task-item">
      <input type="checkbox" checked={task.completed} readOnly />
      <div className="task-body">
        <div className={`task-title ${task.completed ? "done" : ""}`}>
          {task.title}
        </div>
        {task.due_date && <div className="task-meta">Due {task.due_date}</div>}
      </div>
      <span className={`badge ${task.priority}`}>{task.priority}</span>
    </li>
  );
}

export default TaskItem;