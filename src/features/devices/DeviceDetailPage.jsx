import { useState } from "react";
import { useParams, Link } from "react-router-dom"; 
import { useDeviceHistory } from "../../hooks/useDeviceHistory";
import ComplianceBadge from "../../components/shared/ComplianceBadge";
import LocationHistoryTab from "./components/LocationHistoryTab";
import PermissionHistoryTab from "./components/PermissionHistoryTab";
import EditDeviceForm from "./components/EditDeviceForm";
import LiveMapTab from "./components/LiveMapTab";
import CommandPanel from "./components/CommandPanel";
import PromoteToAdminButton from "./components/PromoteToAdminButton";
import { ArrowLeft, MapPin, Shield, Smartphone, Mail, Camera,Mic, Navigation } from "lucide-react";
import MediaLogsTab from "./components/MediaLogsTab";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react"; 
import { useSocket } from "../../context/SocketContext";

export default function DeviceDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState("location");
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useDeviceHistory(id);
  const socket = useSocket();
  const [isOnline, setIsOnline] = useState(false);
  const [liveCoords, setLiveCoords] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  useEffect(() => {
  if (data?.device) {
    setIsOnline(data.device.isOnline || data.device.status === "online");
  }
}, [data?.device]);

useEffect(() => {
  if (!socket) return;

  const isMatchingDevice = (payload) => {
    if (!payload) return false;
    const targetId = String(payload.deviceId || payload.targetDeviceId || payload._id || payload.id || "");
    const currentId = String(id);
    return targetId === currentId || (data?.device?._id && targetId === String(data.device._id));
  };

  const handleDeviceStatusChange = (payload) => {
    const currentMongoId = String(id || data?.device?._id || "");
    const targetMongoId = String(payload?._id || "");
    if (targetMongoId === currentMongoId) {
      setIsOnline(Boolean(payload.isOnline));
    }
  };

  const handleLiveLocationUpdate = (payload) => {
    if (isMatchingDevice(payload)) {
      setLiveCoords({
        lat: payload.latitude,
        lng: payload.longitude,
        timestamp: payload.timestamp || new Date(),
      });
      setIsFetchingLocation(false); // Stop loading state
    }
  };

  const handleProgressUpdate = (payload) => {
    if (!isMatchingDevice(payload)) return;

    const status = String(payload?.status || payload?.commandStatus || payload?.state || "").toLowerCase();
    const action = String(payload?.action || payload?.commandType || payload?.type || payload?.command || "").toLowerCase();

    // 💡 FIX 2: Live Location fetching status check
    if (action.includes("location") || action.includes("fetch")) {
      setIsFetchingLocation(true);
    }

    const isAudioAction = action.includes("audio") || action.includes("record");
    const isActiveStatus = ["recording", "pending", "sent", "started", "processing"].includes(status);

    if (isAudioAction && isActiveStatus) {
      setIsRecordingAudio(true);
    }
  };

  const handleResultUpdate = (payload) => {
    if (!isMatchingDevice(payload)) return;

    const status = String(payload?.status || payload?.commandStatus || "").toLowerCase();
    const isFinished = ["executed", "completed", "failed", "success", "done"].includes(status);

    if (isFinished) {
      setIsRecordingAudio(false);
      setIsFetchingLocation(false);
      queryClient.invalidateQueries(["deviceHistory", id]);
    }
  };

  socket.on("command-progress", handleProgressUpdate);
  socket.on("command-status", handleProgressUpdate);
  socket.on("command-sent", handleProgressUpdate);
  socket.on("command-result-received", handleResultUpdate);
  socket.on("command-executed", handleResultUpdate);
  socket.on("device-status-changed", handleDeviceStatusChange);
  socket.on("admin-live-location-update", handleLiveLocationUpdate);

  return () => {
    socket.off("command-progress", handleProgressUpdate);
    socket.off("command-status", handleProgressUpdate);
    socket.off("command-sent", handleProgressUpdate);
    socket.off("command-result-received", handleResultUpdate);
    socket.off("command-executed", handleResultUpdate);
    socket.off("device-status-changed", handleDeviceStatusChange);
    socket.off("admin-live-location-update", handleLiveLocationUpdate);
  };
}, [id, queryClient, socket, data?.device?._id]);
 
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
  
  const photoLogs = mediaLogs.filter((item) => 
    item.mediaType === "photo" || 
    item.type === "photo" || 
    item.commandType === "capture_photo" ||
    item.action === "capture_photo"
  );

  const audioLogs = mediaLogs.filter((item) => 
    item.mediaType === "audio" || 
    item.type === "audio" || 
    item.commandType === "record_audio" ||
    item.action === "record_audio"
  );
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


         <div className="flex items-center gap-2">
              {/* Live Socket Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isOnline
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                  }`}
                />
                {isOnline ? "Online" : "Offline"}
              </span>

              {/* Existing Compliance Badge */}
              <ComplianceBadge isCompliant={device?.isCompliant} />
            </div>
      </div>
       </div>

      {/* Grid Layout (Left: Logs & Actions | Right: Settings & Admin) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Remote Commands */}
          <CommandPanel 
              deviceId={device._id}
              onTabChange={setTab} 
              onCommandSent={(commandType) => {
                if (commandType === "record_audio" || commandType === "AUDIO_RECORDING") {
                  setIsRecordingAudio(true);
                }
              }}
            />


          {/* Real-time Audio Recording Alert Banner */}
          {isRecordingAudio && (
            <div className="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs animate-pulse">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span>
                <strong>Audio Recording in Progress:</strong> The target device is capturing audio. Logs will update automatically when uploaded.
              </span>
            </div>
          )}

          {/* Activity Logs Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Tab Controls */}
            <div className="flex border-b border-slate-200 bg-slate-50/50">
              
              <button
                onClick={() => setTab("live-map")}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                  tab === "live-map" ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Navigation size={15} /> Live Map Stream
              </button>

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
                onClick={() => setTab("photos")}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 ${
                  tab === "photos"
                    ? "border-blue-600 text-blue-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Camera size={15} /> Photos ({photoLogs.length})
              </button>

              <button
                onClick={() => setTab("audio")}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 ${
                  tab === "audio"
                    ? "border-blue-600 text-blue-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Mic size={15} /> Audio ({audioLogs.length})
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-5">
              {tab === "live-map" && <LiveMapTab liveCoords={liveCoords} isFetching={isFetchingLocation} />}
                {tab === "location" && <LocationHistoryTab history={locationHistory} />}
                {tab === "permissions" && <PermissionHistoryTab history={permissionHistory} />}
                {tab === "photos" && <MediaLogsTab mediaLogs={photoLogs} filterType="photo" />}
                {tab === "audio" && <MediaLogsTab mediaLogs={audioLogs} filterType="audio" />} </div>
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