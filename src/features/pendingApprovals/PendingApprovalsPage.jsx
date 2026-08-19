import { usePendingDevices } from "../../hooks/usePendingDevices";
import PendingRow from "./components/PendingRow";
import { Clock, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";

export default function PendingApprovalsPage() {
  const { data: pending = [], isLoading, isError } = usePendingDevices();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3 text-slate-400">
        <Loader2 size={24} className="animate-spin text-blue-600" />
        <p className="text-xs">Fetching pending device enrollments...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
        <ShieldAlert size={16} />
        <span>Failed to load pending device registrations. Please refresh the page.</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pending Approvals</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review and authorize newly registered device enrollments
          </p>
        </div>

        {/* Counter Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full">
          <Clock size={14} className="text-amber-600" />
          {pending.length} Pending Registration{pending.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Main Table Card */}
      {pending.length === 0 ? (
        <div className="py-16 bg-white rounded-xl border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800">All Clear!</h3>
            <p className="text-xs text-slate-400">No pending device registrations awaiting review.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Device ID</th>
                <th className="px-4 py-3">Request Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pending.map((device) => (
                <PendingRow key={device._id} device={device} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}