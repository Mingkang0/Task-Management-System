"use client";

import useTaskApi from "@/lib/api/task";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  Textarea,
  Select,
  Datepicker,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { PriorityLevel, TaskStatus } from "@/enum";
import useApiWrapper from "@/util/apiWrapper";

interface EditTaskModalProps {
  taskId: number;
  onClose: () => void;
  onTaskUpdated?: () => void; // Optional callback when a task is updated
}

export default function EditTaskModal({ taskId, onClose, onTaskUpdated }: EditTaskModalProps) {
  const { getTaskById, updateTask } = useTaskApi();
  const { apiWrapper } = useApiWrapper();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: TaskStatus.Pending,
    priorityLevel: PriorityLevel.Low,
    dueDate: new Date(),
  });
  const fetchTaskDetails = async (id: number) => {
    try {
      const responses = await apiWrapper([
        {
          apiCallback: getTaskById,
          args: [id],
        },
      ], { pageLoading: true });
      const response = responses && responses[0];
      if (response && response.data) {
        setFormData({
          title: response.data.title,
          description: response.data.description || "",
          status: response.data.status,
          priorityLevel: response.data.priorityLevel,
          dueDate: new Date(response.data.dueDate), // Convert ISO string to Date object
        });
      }
    } catch (error) {
      console.error("Failed to fetch task details:", error);
    }
  }

  useEffect(() => {
    fetchTaskDetails(taskId)
  }, [taskId]); // Fetch task details when component mounts or taskId changes


  const taskStatusOptions = Object.keys(TaskStatus)
    .filter((key) => isNaN(Number(key))) // get only enum names
    .map((key) => (
      <option key={key} value={TaskStatus[key as keyof typeof TaskStatus]}>
        {key.replace(/([A-Z])/g, " $1").trim()} {/* e.g. InProgress → In Progress */}
      </option>
    ));
  const priorityLevelOptions = Object.keys(PriorityLevel)
    .filter((key) => isNaN(Number(key)))
    .map((key) => (
      <option key={key} value={PriorityLevel[key as keyof typeof PriorityLevel]}>
        {key}
      </option>
    ));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiWrapper([
        {
          apiCallback: updateTask,
          args: [
            taskId,
            {
              title: formData.title,
              description: formData.description,
              status: Number(formData.status), // Convert to number
              priorityLevel: Number(formData.priorityLevel), // Convert to number
              dueDate: formData.dueDate.toISOString(), // Convert Date to ISO string for API
            },
          ],
        },
      ], { pageLoading: false });
      onTaskUpdated?.(); // Call the optional callback if provided
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <Modal show={true} onClose={onClose} popup={true} size="xl">
      <ModalHeader>Edit Task</ModalHeader>
      <hr className="border-gray-300" />
      <ModalBody>
        <form id="edit-form" onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="title">Title</Label>
            <TextInput
              id="title"
              name="title"
              type="text"
              placeholder="Enter task title"
              value={formData.title ?? ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter task description"
              value={formData.description ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              name="status"
              value={formData.status ?? TaskStatus.Pending}
              onChange={handleChange}
            >
              {taskStatusOptions}
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="priorityLevel">Priority Level</Label>
            <Select
              id="priorityLevel"
              name="priorityLevel"
              value={formData.priorityLevel ?? PriorityLevel.Low}
              onChange={handleChange}
            >
              {priorityLevelOptions}
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="dueDate">Due Date</Label>
            <Datepicker
              id="dueDate"
              name="dueDate"
              value={
                formData.dueDate && !isNaN(formData.dueDate.getTime())
                  ? formData.dueDate
                  : new Date()
              }
              onChange={(date: Date | null) => {
                if (date) {
                  setFormData({ ...formData, dueDate: date });
                }
              }}
            />
          </div>
        </form>
      </ModalBody>
      <hr className="border-gray-300" />
      <ModalFooter className="flex justify-center space-x-2 p-4">
        <Button type="submit" color="blue" form="edit-form">Save Changes</Button>
        <Button color="gray" onClick={onClose}>Cancel</Button>
      </ModalFooter>
    </Modal>
  )
}