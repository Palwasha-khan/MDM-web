import { useState } from "react";
import toast from "react-hot-toast";
import { Lock, Clock, Save } from "lucide-react";

export default function MdmPoliciesForm() {
  const [saving, setSaving] = useState(false);
  const [policies, setPolicies] = useState({
    minPasscodeLength: 6,
    maxFailedAttempts: 5,
    locationSyncInterval: "15",
    blockRootedDevices: true,
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate policy update API call or connect your endpoint here
    setTimeout(() => {
      toast.success("MDM system policies updated");
      setSaving(false);
    }, 600);
  };

  return (
    <form
      onSubmit={handleSave}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6"
    >
      <div className="border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-800 text-sm">Default Device Policies</h3>
        <p className="text-xs text-slate-400">
          Global enforcement configurations pushed to registered devices
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Passcode Rules */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Lock size={14} className="text-blue-600" /> Security Controls
          </h4>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Minimum Passcode Length
            </label>
            <select
              value={policies.minPasscodeLength}
              onChange={(e) =>
                setPolicies({ ...policies, minPasscodeLength: Number(e.target.value) })
              }
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value={4}>4 Digits</option>
              <option value={6}>6 Digits (Recommended)</option>
              <option value={8}>8 Digits Complex</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Max Failed Passcode Attempts Before Wipe
            </label>
            <select
              value={policies.maxFailedAttempts}
              onChange={(e) =>
                setPolicies({ ...policies, maxFailedAttempts: Number(e.target.value) })
              }
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value={3}>3 Attempts</option>
              <option value={5}>5 Attempts</option>
              <option value={10}>10 Attempts</option>
            </select>
          </div>
        </div>

        {/* Sync Settings */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={14} className="text-blue-600" /> Telemetry & Sync
          </h4>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Location Telemetry Sync Rate
            </label>
            <select
              value={policies.locationSyncInterval}
              onChange={(e) =>
                setPolicies({ ...policies, locationSyncInterval: e.target.value })
              }
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value="5">Every 5 Minutes (Real-Time)</option>
              <option value="15">Every 15 Minutes (Balanced)</option>
              <option value="30">Every 30 Minutes (Battery Saver)</option>
            </select>
          </div>

          <div className="pt-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-slate-700">
                Block & Quarantine Rooted Devices
              </span>
              <input
                type="checkbox"
                checked={policies.blockRootedDevices}
                onChange={(e) =>
                  setPolicies({ ...policies, blockRootedDevices: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-5 rounded-lg transition disabled:opacity-50"
        >
          <Save size={14} /> {saving ? "Saving..." : "Save System Policies"}
        </button>
      </div>
    </form>
  );
}