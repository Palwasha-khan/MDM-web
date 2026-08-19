import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Eye-friendly Muted Emerald & Rose Red
const COLORS = { 
  Compliant: "#10b981", 
  "Non-Compliant": "#f43f5e" 
};

export default function ComplianceChart({ compliant, nonCompliant }) {
  const total = compliant + nonCompliant;
  const compliantPercentage = total > 0 ? Math.round((compliant / total) * 100) : 0;

  const data = [
    { name: "Compliant", value: compliant },
    { name: "Non-Compliant", value: nonCompliant },
  ];

  const hasData = total > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <h3 className="text-base font-bold text-slate-800">Compliance Breakdown</h3>
        <p className="text-xs text-slate-400">Fleet status comparison</p>
      </div>

      {hasData ? (
        <div className="relative my-2">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                cornerRadius={6}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Percentage Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-slate-800">{compliantPercentage}%</span>
            <span className="text-[11px] font-medium text-slate-400">Compliant</span>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center text-slate-400 text-sm">
          No devices enrolled yet
        </div>
      )}

      {/* Legend Bar */}
      <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-slate-600">Compliant ({compliant})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span className="text-slate-600">Non-Compliant ({nonCompliant})</span>
        </div>
      </div>
    </div>
  );
}