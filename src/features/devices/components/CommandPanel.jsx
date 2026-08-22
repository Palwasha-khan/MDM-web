import { useState } from "react";
import { sendCommand } from "../../../api/endpoints/deviceApi";
import toast from "react-hot-toast";
import { BellRing, Lock, AlertTriangle, Loader2, Camera, Mic, MapPin } from "lucide-react";

const commands = [
  { 
    type: "fetch_location", 
    label: "Fetch Live Location", 
    icon: MapPin, 
    targetTab: "live-map",
    requiresOnline: true,
    permissionKey: "location",
    badgeClass: "bg-purple-500/10 text-purple-700 border-purple-300 hover:bg-purple-600 hover:text-white" 
  },
  { 
    type: "capture_photo", 
    label: "Take Photo", 
    icon: Camera, 
    targetTab: "photos",
    requiresOnline: true,
    permissionKey: "camera", 
    badgeClass: "bg-blue-500/10 text-blue-700 border-blue-300 hover:bg-blue-600 hover:text-white" 
  },
  { 
    type: "record_audio", 
    label: "Record Audio (10s)", 
    icon: Mic, 
    targetTab: "audio",
    requiresOnline: true,
    permissionKey: "microphone",
    badgeClass: "bg-emerald-500/10 text-emerald-700 border-emerald-300 hover:bg-emerald-600 hover:text-white" 
  },
  { 
    type: "lock_warning", 
    label: "Lock Warning", 
    icon: Lock, 
    targetTab: null,
    requiresOnline: false,
    badgeClass: "bg-rose-500/10 text-rose-700 border-rose-300 hover:bg-rose-600 hover:text-white" 
  },
  { 
    type: "compliance_warning", 
    label: "Compliance Warning", 
    icon: AlertTriangle,
    targetTab: null, 
    requiresOnline: false,
    badgeClass: "bg-orange-500/10 text-orange-700 border-orange-300 hover:bg-orange-500 hover:text-white" 
  },
];

export default function CommandPanel({ deviceId, isOnline,permissions = {}, onTabChange, onCommandSent }) {
  const [sending, setSending] = useState(null);

  const handleSend = async (cmd) => { 

    if (cmd.requiresOnline && !isOnline) {
      toast.error(`Cannot execute "${cmd.label}": Device is offline.`);
      return;
    }

    if (cmd.permissionKey && permissions[cmd.permissionKey] === false) {
      toast.error(`Cannot execute "${cmd.label}": ${cmd.permissionKey} permission is disabled on the device.`);
      return;
    }

    setSending(cmd.type);
    try {
      await sendCommand(deviceId, cmd.type);
      toast.success("Command dispatched to device");

      if (typeof onCommandSent === "function") {
        onCommandSent(cmd.type);
      }

      if (cmd.targetTab && typeof onTabChange === "function") {
        onTabChange(cmd.targetTab);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send command");
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800">Send Remote Command</h3>
        <p className="text-xs text-slate-400">Execute background actions on the target device</p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {commands.map((cmd) => {
          const Icon = cmd.icon;
          const isCurrentSending = sending === cmd.type;
          const isButtonDisabled = sending !== null || (cmd.requiresOnline && !isOnline);
          const isPermissionDenied = cmd.permissionKey && permissions[cmd.permissionKey] === false;
 
          const buttonTooltip = !isOnline && cmd.requiresOnline
            ? "Device is offline"
            : isPermissionDenied
            ? `${cmd.permissionKey} permission denied on device`
            : "";

          return (
            <button
              key={cmd.type}
              onClick={() => handleSend(cmd)}
              disabled={isButtonDisabled}
              title={buttonTooltip}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border rounded-lg transition-all duration-150 ${
                isButtonDisabled
                  ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200" 
                  : cmd.badgeClass
              } ${sending !== null ? "disabled:opacity-40" : ""}`}
            >
              {isCurrentSending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Icon size={14} />
              )}
              {isCurrentSending ? "Dispatching..." : cmd.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}