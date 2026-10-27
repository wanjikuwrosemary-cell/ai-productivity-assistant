function TaskItem({ task }) {
  return (
    <li>
      <input type="checkbox" checked={task.completed} readOnly />
      <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
        {task.title}
      </span>
    </li>
  );
}

export default TaskItem;