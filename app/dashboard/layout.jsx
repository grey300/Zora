"use client";
import React, { useState } from "react";
import SideBar from "./_components/SideBar";
import Header from "./_components/Header";
import ChatBot from "@/components/ChatBot";

function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0B0E14]">
      {/* Desktop sidebar */}
      <div suppressHydrationWarning className="hidden md:block">
        <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile sidebar overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden">
          <div className="fixed inset-y-0 left-0 w-64">
            <SideBar collapsed={false} setCollapsed={() => setShowMobileSidebar(false)} />
          </div>
          <div
            className="absolute inset-0"
            onClick={() => setShowMobileSidebar(false)}
          ></div>
        </div>
      )}

      <div
        className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Header setShowMobileSidebar={setShowMobileSidebar} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>

      <ChatBot />
    </div>
  );
}

export default DashboardLayout;
