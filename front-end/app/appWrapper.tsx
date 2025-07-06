"use client";

import { useEffect, useState, createContext } from "react";
import Navbar from "@/components/navbar";
import { useAuth } from "@/util/authContext";


export default function AppWrapper({ children }: { children: React.ReactNode }) {

  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      {children}
    </>
  );
}
