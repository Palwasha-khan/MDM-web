import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User, Bell } from "lucide-react";

export default function Topbar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-8 py-3.5 bg-white border-b border-slate-200 shadow-xs">
      {/* Left side status indicator */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          System Active
        </span>
      </div>

      {/* Right side user controls */}
      <div className="flex items-center gap-6">
        {/* Quick Notifications Placeholder */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
          <Bell size={18} />
        </button>

        <div className="h-4 w-px bg-slate-200" />

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
            {admin?.name ? admin.name.charAt(0).toUpperCase() : <User size={14} />}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">
              {admin?.name || "System Admin"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Administrator</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-200"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}