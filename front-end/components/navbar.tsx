import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/util/authContext";

export default function navbar() {
  const Router = useRouter();
  const { setAuth } = useAuth();
  const handleLogOut = () => {
    localStorage.removeItem("authToken");
    setAuth(false); // Update authentication state
    Router.push("/");
  };
  return (
    <Navbar fluid rounded>
      <NavbarBrand href="/dashboard">
        <span className="self-center whitespace-nowrap text-lg md:text-xl font-semibold dark:text-white">
          Task Management System
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <Button onClick={handleLogOut}>Log Out</Button>
      </div>
    </Navbar>
  );
}