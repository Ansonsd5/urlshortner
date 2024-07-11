import Header from "@/components/header/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen container">
        <Header/>
        <Outlet />
      </main>
      <div className="bg-gray-700 text-green-400 text-center">
        Made with Love By Anson
      </div>
    </div>
  );
};

export default AppLayout;
