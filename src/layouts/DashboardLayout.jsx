import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout({ children }) {
  // HIGHLIGHT: Added state for mobile sidebar drawer toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* HIGHLIGHT: On mobile, remove fixed width wrapper completely. Keep w-64 only on desktop (md:block) */}
      <div className="hidden md:block w-64 shrink-0 h-full">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* HIGHLIGHT: Render overlay drawer sidebar for mobile screens */}
      <div className="md:hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* HIGHLIGHT: Pass menu click handler to Topbar */}
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}