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
import { useState } from "react";
import { PriorityLevel, TaskStatus } from "@/enum";
import useApiWrapper from "@/util/apiWrapper";
import { useGeneralContext } from "@/util/generalProvider";

interface AddTaskModalProps {
  onClose: () => void;
  onTaskCreated?: () => void; // Optional callback when a task is created
}

export default function AddTaskModal({ onClose, onTaskCreated }: AddTaskModalProps) {
  const { createTask } = useTaskApi();
  const { apiWrapper } = useApiWrapper();
  const { setIsLoading } = useGeneralContext();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: TaskStatus.Pending,
    priorityLevel: PriorityLevel.Low,
    dueDate: new Date(),
  });

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Assuming you have a setIsLoading function to show loading state
    try {
      await apiWrapper([
        {
          apiCallback: createTask,
          args: [
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
      if (onTaskCreated) {
        onTaskCreated();
      }
      onClose();
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({ ...formData, dueDate: date });
    }
  };

  return (
    <Modal show={true} size="xl" popup={true} onClose={onClose}>
      <ModalHeader className="pl-6 pt-4 pb-2">Add Task</ModalHeader>
      <hr className="border-gray-300" />
      <ModalBody className="pt-2">
        <form id="addTaskForm" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <TextInput
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select status</option>
              {taskStatusOptions}
            </Select>
          </div>
          <div>
            <Label htmlFor="priorityLevel">Priority Level</Label>
            <Select
              id="priorityLevel"
              name="priorityLevel"
              value={formData.priorityLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select priority</option>
              {priorityLevelOptions}
            </Select>
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Datepicker
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleDateChange}
            />
          </div>
        </form>
      </ModalBody>
      <hr className="border-gray-300" />
      <ModalFooter className="flex justify-center space-x-2 p-4">
        <Button type="submit" form="addTaskForm" color="blue">
          Add Task
        </Button>
        <Button color="gray" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
