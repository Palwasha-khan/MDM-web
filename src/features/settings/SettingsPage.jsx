import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ChangePasswordForm from "./components/ChangePasswordForm";
import MdmPoliciesForm from "./components/MdmPoliciesForm";
import { User, ShieldCheck, Mail, Shield } from "lucide-react";

export default function SettingsPage() {
  const { admin } = useAuth();
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your account credentials and system-wide MDM configurations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-sm font-semibold text-slate-500 gap-6">
        <button
          onClick={() => setActiveTab("account")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === "account"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent hover:text-slate-800"
          }`}
        >
          <User size={16} /> Account & Security
        </button>
        <button
          onClick={() => setActiveTab("policies")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === "policies"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent hover:text-slate-800"
          }`}
        >
          <ShieldCheck size={16} /> MDM System Policies
        </button>
      </div>

      {/* Tab 1: Account Profile & Password Form */}
      {activeTab === "account" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Profile Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
              Admin Profile
            </h3>
            
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0 uppercase">
                {admin?.name ? admin.name.charAt(0) : "A"}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{admin?.name || "System Admin"}</h4>
                <span className="inline-block mt-0.5 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md uppercase">
                  {admin?.role || "Admin"}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs text-slate-600 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-slate-400 shrink-0" />
                <span className="font-medium text-slate-700">Email:</span>
                <span>{admin?.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-slate-400 shrink-0" />
                <span className="font-medium text-slate-700">Privileges:</span>
                <span className="capitalize">{admin?.role || "Standard"} Management Access</span>
              </div>
            </div>
          </div>

          {/* Connected API Change Password Component */}
          <ChangePasswordForm />
        </div>
      )}

      {/* Tab 2: System MDM Policies */}
      {activeTab === "policies" && <MdmPoliciesForm />}
    </div>
  );
}