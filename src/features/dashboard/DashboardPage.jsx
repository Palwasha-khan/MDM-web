import React from "react";
import { useDeviceStats } from "../../hooks/useDeviceStats";
import SummaryCards from "./components/SummaryCards";
import ComplianceChart from "./components/ComplianceChart";
import { SkeletonCards } from "../../components/ui/Skeleton";
import { AlertCircle, ShieldAlert } from "lucide-react";

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useDeviceStats();

  if (isError) return <p className="text-rose-600 p-4">Failed to load dashboard data.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Fleet Overview</h1>
        <p className="text-sm text-slate-500">Real-time status of enrolled devices & security metrics</p>
      </div>

      {isLoading ? (
        <SkeletonCards />
      ) : (
        <>
          <SummaryCards stats={stats} />

          {/* Grid Layout: Donut Chart + Quick Security Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ComplianceChart 
                compliant={stats.compliantDevices} 
                nonCompliant={stats.nonCompliantDevices} 
              />
            </div>

            {/* Recent Security Activity Panel */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Recent Policy Alerts</h3>
                  <p className="text-xs text-slate-400">Hardware & location permission revocations</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-600 rounded-full border border-rose-100">
                  {stats.nonCompliantDevices} Non-Compliant
                </span>
              </div>

              <div className="space-y-3">
                {stats.nonCompliantDevices > 0 ? (
                  <div className="flex items-start gap-3 p-3 bg-rose-50/50 border border-rose-100 rounded-lg">
                    <ShieldAlert className="text-rose-500 mt-0.5 shrink-0" size={18} />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Camera / Microphone Permission Revoked</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        A registered device modified system permissions without approval.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                    <AlertCircle size={24} className="text-slate-300" />
                    <span>All active devices are currently compliant.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}