import TaskItem from "./TaskItem";
import { fakeTasks } from "../data/fakeTasks";

function TaskList() {
  return (
    <div>
      <h1>My Tasks</h1>
      <p>Today • {fakeTasks.length} tasks</p>

      <ul>
        {fakeTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}

export default TaskList;