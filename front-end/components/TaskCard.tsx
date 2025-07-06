import { Card } from "flowbite-react";
import { TaskStatus, PriorityLevel } from "@/enum";
import { FaPen, FaTrash } from "react-icons/fa";
import { useState } from "react";
import EditTaskModal from "./EditTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";

interface TaskInterface {
  refreshTasks: () => void;
  task: any;
}

export default function TaskCard({ task, refreshTasks }: TaskInterface) {

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = (taskId: number) => () => {
    setShowEditModal(true);
  };
  return (
    <>
      <Card className="w-full max-w-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Title: {task.title}
          </h5>
          <div className="flex space-x-2">
            <div className="bg-blue-600 hover:bg-blue-800 p-2" onClick={handleEdit(task.id)}>
              <FaPen size={20} className="cursor-pointer text-white" />
            </div>
            <div className="bg-red-600 hover:bg-red-800 p-2" onClick={() => setShowDeleteModal(true)}>
              <FaTrash size={20} className="cursor-pointer text-white" />
            </div>
          </div>
        </div>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Description: {task.description}
        </p>
        <hr className="border-gray-300" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Date: {new Date(task.dueDate).toLocaleDateString()}</span>
          <span className="text-sm text-gray-500">Priority: {PriorityLevel[task.priorityLevel]}</span>
          <span className="text-sm text-gray-900 px-4 py-1 bg-gray-200 rounded-2xl">Status: {TaskStatus[task.status]}</span>
        </div>
      </Card>
      {
        showEditModal && (
          <EditTaskModal
            taskId={task.id}
            onClose={() => setShowEditModal(false)}
            onTaskUpdated={refreshTasks}
          />
      )
      }
      {
        showDeleteModal && (
          <DeleteTaskModal
            taskId={task.id}
            onClose={() => setShowDeleteModal(false)}
            onTaskDeleted={refreshTasks}
          />
        )
      }
    </>
  );
}