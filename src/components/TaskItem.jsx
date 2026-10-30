function TaskItem({ task }) {
  return (
    <li>
      <input type="checkbox" checked={task.completed} readOnly />
      <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
        {task.title}
      </span>
      <small> [{task.priority}]{task.due_date ? ` • due ${task.due_date}` : ""}</small>
    </li>
  );
}

export default TaskItem;