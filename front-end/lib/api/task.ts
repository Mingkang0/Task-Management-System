interface CreateTaskPayload {
  title: string;
  description?: string;
  status: number; // ✅ must be number, not string
  priorityLevel: number; // ✅ must be number
  dueDate?: string; // ISO string
}

export default function useTaskApi() {

  const baseUrl = 'http://localhost:5193/api/taskitems';

  const getTasks = async () => {
    const response = await fetch(`${baseUrl}/getAll`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  };

  const getTaskById = async (id: number) => {
    const response = await fetch(`${baseUrl}/get/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }
    return response.json();
  };

  const createTask = async (task: CreateTaskPayload) => {
    const response = await fetch(`${baseUrl}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return response.json();
  };

  const updateTask = async (id: number, task: CreateTaskPayload) => {
    const response = await fetch(`${baseUrl}/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    return response.json();
  };

  const deleteTask = async (id: number) => {
    const response = await fetch(`${baseUrl}/delete/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  };

  return { getTasks, getTaskById, createTask, updateTask, deleteTask };
}