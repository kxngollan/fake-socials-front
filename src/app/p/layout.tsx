import React from "react";
import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

import "./layout/othercopy.css"

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ProtectedRoute>
      <div id="main">
        <Header />
        <div id="page">
          <Sidebar />
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default layout;
