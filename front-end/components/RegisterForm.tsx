'use client';
import { Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useAuthApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import useApiWrapper from "@/util/apiWrapper";
import { useGeneralContext } from "@/util/generalProvider";
import { useAuth } from "@/util/authContext";

export function RegisterForm() {
  const { apiWrapper } = useApiWrapper();
  const { setAuth } = useAuth();
  const { setIsLoading } = useGeneralContext();
  const Router = useRouter();
  const { register } = useAuthApi();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

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
        apiCallback: register,
        args: [email, password]
      }
    ], { pageLoading: true });
    if (response && response.token) {
      localStorage.setItem("authToken", response.token);
      setIsLoading(false);
      setAuth(true); // Assuming you have a setAuth function in your auth context
      Router.push("/dashboard");
    } else {
      setError("Login failed. Please try again.");
    }
  }
  return (
    <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Task Management System</h1>
      
      <hr className="mb-4 border-gray-900" />
      <p className="text-2xl text-gray-900 mb-6 text-center font-semibold">Register</p>
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
        </div>
        <div className="mb-4">
          <div className="block">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
          </div>
          <TextInput id="confirmPassword" type="password" placeholder="Confirm your password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required />
        </div>
        <Button type="submit" className="w-full">Register</Button>
      </form>
      <p className="text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <a href="/" className="text-blue-600 hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
}
