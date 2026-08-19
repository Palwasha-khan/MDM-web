import { NavLink } from "react-router-dom";
import { usePendingCount } from "../../hooks/usePendingCount";
import { 
  LayoutDashboard, 
  Smartphone, 
  MapPin, 
  UserCheck, 
  Settings, 
  ShieldCheck 
} from "lucide-react";

export default function Sidebar() {
  const { data: pendingCount = 0 } = usePendingCount();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/devices", label: "Devices", icon: Smartphone },
    { to: "/map", label: "Live Map", icon: MapPin },
    { to: "/pending-approvals", label: "Pending Approvals", icon: UserCheck, badge: pendingCount },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-full flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300">
      {/* App Branding Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="text-base font-bold text-white leading-none">MDM Admin</h2>
          <span className="text-[11px] text-slate-400 font-medium">Control Center</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>

                  {/* Badge Indicator */}
                  {item.badge > 0 && (
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Branding or System Version */}
      <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-500">
        v1.0.0 • Secure Enterprise MDM
      </div>
    </aside>
  );
}