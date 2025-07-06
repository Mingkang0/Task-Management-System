import useApiWrapper from "@/util/apiWrapper";
import useTaskApi from "@/lib/api/task";
import {
  Button,
  Modal,
  ModalBody,
} from "flowbite-react";
import { FaExclamationCircle } from "react-icons/fa";

interface DeleteTaskModalProps {
  taskId: number;
  onClose: () => void;
  onTaskDeleted?: () => void; // Optional callback when a task is deleted
}

export default function DeleteTaskModal({ taskId, onClose, onTaskDeleted }: DeleteTaskModalProps) {
  const { deleteTask } = useTaskApi();
  const { apiWrapper } = useApiWrapper();

  const handleDelete = async () => {
    try {
      await apiWrapper([
        {
          apiCallback: deleteTask,
          args: [taskId],
        },
      ], { pageLoading: false });
      onTaskDeleted?.(); // Call the optional callback if provided
      onClose(); // Close the modal after successful deletion
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <Modal show={true} onClose={onClose}>
      <ModalBody className="text-center">
        <div className="font-semibold mb-4">
          <FaExclamationCircle className="inline mr-2 text-red-600" size={128}/>
        </div>
        Are you sure you want to delete this task?
        <div className="flex justify-center mt-4 gap-4">
        <Button color="red" onClick={handleDelete}>
          Delete
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}