import React from "react";
import "@/assets/styles/globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";

export const metadata = {
  title: "Eureka",
  description: "Intuitive solutions for competitive programming contests",
};

const MainLayout = ({ children }) => {
  return (
    <AuthProvider>
      <html className="h-full">
        <body className="h-full">
          <div className="h-full bg-gray-800">
            <Navbar />
            <div className="flex-grow">{children}</div>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
};

export default MainLayout;
