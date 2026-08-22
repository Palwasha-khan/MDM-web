import { NavLink } from "react-router-dom";
import { usePendingCount } from "../../hooks/usePendingCount";
import { 
  LayoutDashboard, 
  Smartphone, 
  MapPin, 
  UserCheck, 
  Settings, 
  ShieldCheck,
  X 
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const { data: pendingCount = 0 } = usePendingCount();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/devices", label: "Devices", icon: Smartphone },
    { to: "/map", label: "Live Map", icon: MapPin },
    { to: "/pending-approvals", label: "Pending Approvals", icon: UserCheck, badge: pendingCount },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 h-full flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* App Branding Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-none">MDM Admin</h2>
              <span className="text-[11px] text-slate-400 font-medium">Control Center</span>
            </div>
          </div>

          {/* Close Button for Mobile */}
          <button 
            onClick={onClose} 
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X size={20} />
          </button>
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
                    onClick={onClose} // Auto close drawer when navigating on mobile
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
    </>
  );
}