import TasksList from "@/components/TasksList";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-full p-6">
        <TasksList />
      </div>
    </div>
  );
}