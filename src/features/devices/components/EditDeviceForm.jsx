import { useState } from "react";
import { updateDevice } from "../../../api/endpoints/deviceApi";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";

export default function EditDeviceForm({ device }) {
  const [employeeName, setEmployeeName] = useState(device.employeeName || "");
  const [email, setEmail] = useState(device.email || "");
  const [deviceId, setDeviceId] = useState(device.deviceId || "");
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDevice(device._id, { employeeName, email, deviceId });
      toast.success("Device records updated");
      queryClient.invalidateQueries(["deviceHistory", device._id]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update record.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800">Edit Device Information</h3>
        <p className="text-xs text-slate-400">Update employee links and identifier parameters</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Employee Full Name</label>
          <input
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Hardware Device ID</label>
          <input
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg px-4 py-2.5 transition shadow-xs disabled:opacity-50"
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {saving ? "Saving Changes..." : "Save Record Updates"}
      </button>
    </form>
  );
}