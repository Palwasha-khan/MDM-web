import { useNavigate } from "react-router-dom";
import ComplianceBadge from "../../../components/shared/ComplianceBadge";
import { ChevronRight, Smartphone } from "lucide-react";

export default function DeviceTable({ devices }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden w-full">
      {/* Scroll wrapper to prevent full-page expansion */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-162.5 text-sm text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <th className="px-4 sm:px-6 py-3.5">Employee</th>
              <th className="px-4 sm:px-6 py-3.5">Device ID</th>
              <th className="px-4 sm:px-6 py-3.5">Status</th>
              <th className="px-4 sm:px-6 py-3.5">Last Active Ping</th>
              <th className="px-4 py-3.5 text-right"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {devices.map((device) => {
              const firstInitial = device.employeeName ? device.employeeName.charAt(0).toUpperCase() : "E";
              const email = device.employeeEmail || device.email || device.userEmail;

              return (
                <tr
                  key={device._id}
                  onClick={() => navigate(`/devices/${device._id}`)}
                  className="hover:bg-slate-50/80 cursor-pointer transition group"
                >
                  <td className="px-4 sm:px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                        {firstInitial}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-tight truncate">{device.employeeName}</p>
                        {email && <p className="text-xs text-slate-400 mt-0.5 truncate">{email}</p>}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4 text-slate-600 font-mono text-xs whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-medium">
                      <Smartphone size={13} className="text-slate-400 shrink-0" />
                      {device.deviceId}
                    </span>
                  </td>

                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <ComplianceBadge isCompliant={device.isCompliant} />
                  </td>

                  <td className="px-4 sm:px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {device.lastPingAt ? (
                      new Date(device.lastPingAt).toLocaleString(undefined, {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })
                    ) : (
                      <span className="text-slate-400 italic">Never</span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition inline-block" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}