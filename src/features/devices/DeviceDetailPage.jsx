import { useState } from "react";
import { useParams, Link } from "react-router-dom"; 
import { useDeviceHistory } from "../../hooks/useDeviceHistory";
import ComplianceBadge from "../../components/shared/ComplianceBadge";
import LocationHistoryTab from "./components/LocationHistoryTab";
import PermissionHistoryTab from "./components/PermissionHistoryTab";
import EditDeviceForm from "./components/EditDeviceForm";
import CommandPanel from "./components/CommandPanel";
import PromoteToAdminButton from "./components/PromoteToAdminButton";
import { ArrowLeft, MapPin, Shield, Smartphone, Mail, Camera } from "lucide-react";
import MediaLogsTab from "./components/MediaLogsTab";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react"; 
import { useSocket } from "../../context/SocketContext";

export default function DeviceDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState("location");
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useDeviceHistory(id);
   const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleCommandResult = (payload) => {
      // Re-fetch history if command belongs to this device and was executed successfully
      if (payload?.deviceId === id || payload?.status === "executed") {
        queryClient.invalidateQueries(["deviceHistory", id]);
      }
    };

    socket.on("command-result-received", handleCommandResult);

    return () => {
      socket.off("command-result-received", handleCommandResult);
    };
  }, [id, queryClient,socket]);

  if (isLoading) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        Loading device management details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
        Failed to load device details. Please check your backend connection.
      </div>
    );
  }

  const { device, locationHistory = [], permissionHistory = [] ,mediaLogs = []} = data;

  return (
    <div className="space-y-6">
      {/* Top Header Nav */}
      <div>
        <Link
          to="/devices"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-3 transition"
        >
          <ArrowLeft size={14} /> Back to Devices
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{device.employeeName}</h1>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Mail size={13} className="text-slate-400" />
                {device.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                <Smartphone size={13} className="text-slate-400" />
                {device.deviceId}
              </span>
            </div>
          </div>
          <ComplianceBadge isCompliant={device.isCompliant} />
        </div>
      </div>

      {/* Grid Layout (Left: Logs & Actions | Right: Settings & Admin) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Remote Commands */}
          <CommandPanel deviceId={device._id} />

          {/* Activity Logs Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Tab Controls */}
            <div className="flex border-b border-slate-200 bg-slate-50/50">
              
              <button
                onClick={() => setTab("location")}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 ${
                  tab === "location"
                    ? "border-blue-600 text-blue-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <MapPin size={15} /> Location History ({locationHistory.length})
              </button>
             
              <button
                onClick={() => setTab("permissions")}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 ${
                  tab === "permissions"
                    ? "border-blue-600 text-blue-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Shield size={15} /> Permission Changes ({permissionHistory.length})
              </button>

              <button
                onClick={() => setTab("media")}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 ${
                  tab === "media"
                    ? "border-blue-600 text-blue-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Camera size={15} /> Captured Media ({mediaLogs.length})
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-5">
                {tab === "location" && <LocationHistoryTab history={locationHistory} />}
                {tab === "permissions" && <PermissionHistoryTab history={permissionHistory} />}
                {tab === "media" && <MediaLogsTab mediaLogs={mediaLogs} />} {/* 👈 ADD MEDIA TAB BODY */}
              </div>
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          <PromoteToAdminButton deviceId={device._id} employeeName={device.employeeName} />
          <EditDeviceForm device={device} />
        </div>
      </div>
    </div>
  );
}