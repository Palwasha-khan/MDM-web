import { useState } from "react";
import toast from "react-hot-toast";
import { changePasswordRequest } from "../../../api/endpoints/authApi";
import { KeyRound, Loader2 } from "lucide-react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setSaving(true);
    try {
      await changePasswordRequest(currentPassword, newPassword);
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs"
    >
      <div>
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <KeyRound size={16} className="text-slate-500" /> Security Credentials
        </h3>
        <p className="text-xs text-slate-400">Update your account login password</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg px-4 py-2.5 transition disabled:opacity-50"
      >
        {saving && <Loader2 size={14} className="animate-spin" />}
        {saving ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}