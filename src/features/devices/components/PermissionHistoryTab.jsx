// PermissionHistoryTab.jsx
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function PermissionHistoryTab({ history = [] }) {
  if (history.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        No permission changes detected.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
            <th className="py-2.5 px-3">Timestamp</th>
            <th className="py-2.5 px-3">Permission Key</th>
            <th className="py-2.5 px-3">State Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {history.map((entry) => {
            const isGranted = entry.newState?.toLowerCase() === "granted" || entry.newState === true;

            return (
              <tr key={entry._id || entry.timestamp} className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 text-slate-600 font-medium">
                  {new Date(entry.timestamp).toLocaleString(undefined, {
                    dateStyle: 'short',
                    timeStyle: 'medium'
                  })}
                </td>
                <td className="py-2.5 px-3 text-slate-800 font-semibold capitalize">
                  {entry.permissionType}
                </td>
                <td className="py-2.5 px-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[11px] ${
                    isGranted 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                      : "bg-rose-50 text-rose-700 border border-rose-100"
                  }`}>
                    {isGranted ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                    {entry.oldState || "UNKNOWN"} → {entry.newState}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}