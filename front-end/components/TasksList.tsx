'use client';
import useTaskApi from "@/lib/api/task";
import TaskCard from "./TaskCard";
import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import AddTaskModal from "./AddTaskModal";

export default function TasksList() {
  const { getTasks } = useTaskApi();

  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      console.log("Fetched tasks:", response);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const handleAddTaskClick = () => {
    setShowAddTaskModal(true);
  };


  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-2">
        <h1 className="text-xl font-bold text-center">Tasks</h1>
        <Button onClick={handleAddTaskClick}>Add Task</Button>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
      {tasks.length > 0 ? (tasks.map((task: any) => (
        <TaskCard key={task.id} task={task} refreshTasks={fetchTasks} />
      ))
      ) : (
        <p className="text-gray-500 text-center">No tasks found.</p>
      )
      }
      </div>

      {showAddTaskModal &&
        <AddTaskModal
          onClose={() => setShowAddTaskModal(false)}
          onTaskCreated={fetchTasks}
        />}
    </>
  );
}