import { useState } from "react";
import toast from "react-hot-toast";
import { UserCheck, ShieldCheck, Loader2 } from "lucide-react";
import { promoteToAdmin } from "../../../api/endpoints/authApi";

export default function PromoteToAdminButton({ deviceId, employeeName }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false); 

  const handlePromote = async () => {
    if (!confirm(`Promote ${employeeName} to Administrator? They will receive full access permissions.`)) return;
    setLoading(true);
    try {
      await promoteToAdmin(deviceId);
      setDone(true);
      toast.success(`${employeeName} promoted to admin`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to promote employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
          <ShieldCheck size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-slate-800">Role & Privileges</h4>
          <p className="text-[11px] text-slate-400">Elevate to dashboard system operator</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
        {done ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            <UserCheck size={14} /> Administrator Privilege Granted
          </span>
        ) : (
          <button
            onClick={handlePromote}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {loading ? "Promoting User..." : "Promote to Admin"}
          </button>
        )}
      </div>
    </div>
  );
}