import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Sidebar container matching w-64 */}
      <div className="w-64 shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}