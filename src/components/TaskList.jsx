import { useState } from "react";
import TaskItem from "./TaskItem";
import AddTaskForm from "./AddTaskForm";
import { fakeTasks } from "../data/fakeTasks";
import { DEFAULT_STATUS } from "../constants/taskFields";

function TaskList() {
  const [tasks, setTasks] = useState(fakeTasks);

  function handleAddTask(newTask) {
    const taskWithDefaults = {
      ...newTask,
      id: Date.now(), // temporary id; the database will make real ones later
      completed: false,
      status: DEFAULT_STATUS,
    };
    setTasks([...tasks, taskWithDefaults]);
  }

  return (
    <div>
      <h1>My Tasks</h1>
      <p>Today • {tasks.length} tasks</p>

      <AddTaskForm onAddTask={handleAddTask} />

      <ul>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}

export default TaskList;