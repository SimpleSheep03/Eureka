import React from "react";
import "@/assets/styles/globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";

export const metadata = {
  title: "Eureka",
  description: "Intuitive solutions for competitve programming contests",
};

const MainLayout = ({ children }) => {
  return (
    <AuthProvider>
      <html>
        <body>
          <div>
            <Navbar />
            <div className="bg-gray-800">{children}</div>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
};

export default MainLayout;
