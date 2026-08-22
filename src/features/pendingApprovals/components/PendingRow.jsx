import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveDevice, rejectDevice } from "../../../api/endpoints/deviceApi";
import toast from "react-hot-toast";
import { Check, X, Loader2, Smartphone, Mail, AlertTriangle } from "lucide-react";

export default function PendingRow({ device }) {
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: () => approveDevice(device._id),
    onSuccess: () => {
      toast.success(`Approved ${device.employeeName}'s device`);
      queryClient.invalidateQueries(["pendingDevices"]);
      queryClient.invalidateQueries(["devices"]);
      queryClient.invalidateQueries(["deviceStats"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to approve device");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectDevice(device._id),
    onSuccess: () => {
      toast.success(`Rejected registration request`);
      queryClient.invalidateQueries(["pendingDevices"]);
      queryClient.invalidateQueries(["devices"]);
      queryClient.invalidateQueries(["deviceStats"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to reject device");
    },
    onSettled: () => setShowRejectConfirm(false),
  });

  const isPending = approveMutation.isPending || rejectMutation.isPending;

  return (
    <>
      <tr className="border-t border-slate-100 hover:bg-slate-50/50 transition">
        {/* Employee Details */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100 uppercase">
              {device.employeeName ? device.employeeName.charAt(0) : "E"}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-xs truncate">{device.employeeName}</p>
              <p className="text-[11px] text-slate-400">MDM Enrollee</p>
            </div>
          </div>
        </td>

        {/* Email */}
        <td className="px-4 py-3.5 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Mail size={14} className="text-slate-400 shrink-0" />
            {device.email}
          </span>
        </td>

        {/* Device Hardware Identifier */}
        <td className="px-4 py-3.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 font-mono text-[11px] font-medium rounded-md border border-slate-200 whitespace-nowrap">
            <Smartphone size={12} className="text-slate-400 shrink-0" />
            {device.deviceId}
          </span>
        </td>

        {/* Date Registered */}
        <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
          {new Date(device.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </td>

        {/* Action Controls */}
        <td className="px-4 py-3.5 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => approveMutation.mutate()}
              disabled={isPending}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg transition disabled:opacity-50 shadow-xs cursor-pointer"
            >
              {approveMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              Approve
            </button>

            <button
              onClick={() => setShowRejectConfirm(true)}
              disabled={isPending}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              <X size={14} />
              Reject
            </button>
          </div>
        </td>
      </tr>

      {/* Rejection Modal confirmation */}
      {showRejectConfirm && (
        <tr className="bg-rose-50/60 border-t border-rose-100">
          <td colSpan={5} className="px-4 py-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-rose-800">
              <span className="flex items-center gap-2 font-medium">
                <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                Are you sure you want to reject <strong>{device.employeeName}</strong>?
              </span>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => rejectMutation.mutate()}
                  disabled={rejectMutation.isPending}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-md transition disabled:opacity-50"
                >
                  {rejectMutation.isPending ? "Rejecting..." : "Confirm Reject"}
                </button>
                <button
                  onClick={() => setShowRejectConfirm(false)}
                  disabled={rejectMutation.isPending}
                  className="px-3 py-1 bg-white border border-slate-200 text-slate-600 font-semibold rounded-md hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}