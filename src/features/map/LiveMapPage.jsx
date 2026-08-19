import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDevices } from "../../hooks/useDevices";
import { useSocket } from "../../context/SocketContext";
import DeviceMap from "./components/DeviceMap";
import { MapPin, Radio } from "lucide-react";

export default function LiveMapPage() {
  const { data, isLoading, isError } = useDevices({ page: 1,limit:50, search: "", compliance: "" });
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
  if (!socket) return;

  const handleUpdate = (updatedDevice) => {
    
     queryClient.setQueriesData({ queryKey: ["devices"] }, (oldData) => {
      if (!oldData) return oldData;

      // Normalize array structure: handle both `{ devices: [...] }` and raw `[...]`
      let deviceList = [];
      if (Array.isArray(oldData)) {
        deviceList = oldData;
      } else if (Array.isArray(oldData.devices)) {
        deviceList = oldData.devices;
      } else {
        return oldData; // Unexpected shape, skip
      }

      // Flexibly match using String conversion of _id OR deviceId
      const targetId = String(updatedDevice._id || updatedDevice.id);
      const targetDevId = String(updatedDevice.deviceId);

      const exists = deviceList.some(
        (d) => String(d._id) === targetId || String(d.deviceId) === targetDevId
      );

      let updatedList;
      if (exists) {
        // Merge the incoming socket properties into the existing device object
        updatedList = deviceList.map((d) => {
          if (String(d._id) === targetId || String(d.deviceId) === targetDevId) {
            return {
              ...d,
              ...updatedDevice,
              // Ensure location is properly overwritten
              lastKnownLocation: {
                ...d.lastKnownLocation,
                ...updatedDevice.lastKnownLocation,
              },
            };
          }
          return d;
        });
      } else {
        // If it's a brand new device, append it to the list
        updatedList = [...deviceList, updatedDevice];
      }

      // Reconstruct cache data with updated device array
      return Array.isArray(oldData)
        ? updatedList
        : { ...oldData, devices: updatedList };
    });

    // Keep statistics cards fresh
    queryClient.invalidateQueries({ queryKey: ["deviceStats"] });
  };

  socket.on("device-update", handleUpdate); 

  return () => {
    socket.off("device-update", handleUpdate); 
  };
}, [socket, queryClient]);

  if (isLoading) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        Initializing Live GPS Map...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
        Failed to fetch fleet location data.
      </div>
    );
  }

  const devices = data?.devices || [];
  const locatedCount = devices.filter((d) => d.lastKnownLocation?.lat).length;

  return (
    <div className="space-y-4">
      {/* Page Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Map</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time geospatial tracking for active devices</p>
        </div>

        {/* Real-time Indicator Badges */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
            <Radio size={14} className="animate-pulse text-emerald-600" /> Socket Active
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
            <MapPin size={14} className="text-slate-500" /> {locatedCount} / {devices.length} Devices Mapped
          </span>
        </div>
      </div>

      {/* Map Card Viewport */}
      <DeviceMap devices={devices} />
    </div>
  );
}