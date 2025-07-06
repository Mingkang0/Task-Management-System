'use client';
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Using next/navigation for client-side routing
import useApiWrapper from "@/util/apiWrapper";
import { useAuthApi } from "@/lib/api/auth";
import { useAuth } from "@/util/authContext";

export function LoginForm() {
  const { apiWrapper } = useApiWrapper();
  const { login } = useAuthApi();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const Router = useRouter();
  const { setAuth } = useAuth(); // Assuming you have a setAuth function in your auth context
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;
    const [response] = await apiWrapper([
      {
        apiCallback: login,
        args: [email, password]
      }
    ], { pageLoading: true });
    console.log("Login response:", response);
    if (response && response.token) {
      localStorage.setItem("authToken", response.token);
      setAuth(true); // Set authentication state
      Router.push("/dashboard");
    } else {
      setError("Login failed. Please try again.");
    }
  }
  return (
    <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Task Management System</h1>
      <hr className="mb-4 border-gray-900" />
      <p className="text-2xl text-gray-900 mb-6 text-center font-semibold">Login</p>
      <form className="" onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="block">
            <Label htmlFor="email1">Your email</Label>
          </div>
          <TextInput id="email1" type="email" placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>
        <div className="mb-4">
          <div className="block">
            <Label htmlFor="password1">Your password</Label>
          </div>
          <TextInput id="password1" type="password" placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required />
          {
            error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )
          }
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </form>
      <p className="text-sm text-gray-600 mt-4">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Register here
        </a>
      </p>
    </div>
  );
}
