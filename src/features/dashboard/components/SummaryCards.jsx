import React from "react";
import { 
  Smartphone, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Clock 
} from "lucide-react";

export default function SummaryCards({ stats }) {
  const cards = [
    { 
      label: "Total Devices", 
      value: stats.totalDevices, 
      icon: Smartphone, 
      color: "text-slate-800",
      bgColor: "bg-slate-100",
      borderColor: "border-slate-200"
    },
    { 
      label: "Active (last 15m)", 
      value: stats.activeDevices, 
      icon: Activity, 
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    { 
      label: "Compliant", 
      value: stats.compliantDevices, 
      icon: ShieldCheck, 
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100"
    },
    { 
      label: "Non-Compliant", 
      value: stats.nonCompliantDevices, 
      icon: AlertTriangle, 
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100"
    },
    { 
      label: "Pending Approval", 
      value: stats.pendingDevices, 
      icon: Clock, 
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`bg-white rounded-xl border ${card.borderColor} p-4 shadow-xs transition-all hover:shadow-md flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`p-2 rounded-lg ${card.bgColor} ${card.color}`}>
                <Icon size={18} />
              </div>
            </div>
            <div className="mt-3">
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}