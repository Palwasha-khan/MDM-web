import { useState } from "react";
import { sendCommand } from "../../../api/endpoints/deviceApi";
import toast from "react-hot-toast";
import { BellRing, Lock, AlertTriangle, Loader2 } from "lucide-react";

const commands = [
  { 
    type: "ring_alert", 
    label: "Ring Alert", 
    icon: BellRing, 
    badgeClass: "bg-amber-500/10 text-amber-700 border-amber-300 hover:bg-amber-500 hover:text-white" 
  },
  { 
    type: "lock_warning", 
    label: "Lock Warning", 
    icon: Lock, 
    badgeClass: "bg-rose-500/10 text-rose-700 border-rose-300 hover:bg-rose-600 hover:text-white" 
  },
  { 
    type: "compliance_warning", 
    label: "Compliance Warning", 
    icon: AlertTriangle, 
    badgeClass: "bg-orange-500/10 text-orange-700 border-orange-300 hover:bg-orange-500 hover:text-white" 
  },
];

export default function CommandPanel({ deviceId }) {
  const [sending, setSending] = useState(null);

  const handleSend = async (commandType) => {
    setSending(commandType);
    try {
      await sendCommand(deviceId, commandType);
      toast.success("Command dispatched to device");
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

          return (
            <button
              key={cmd.type}
              onClick={() => handleSend(cmd.type)}
              disabled={sending !== null}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold border rounded-lg transition-all duration-150 disabled:opacity-40 ${cmd.badgeClass}`}
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