import { MapPin, Compass } from "lucide-react";
import { useState, useEffect } from "react";

export default function LiveMapTab({ liveCoords, isFetching }) {
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  // HIGHLIGHT: When new coordinates arrive, trigger loading state for iframe
  useEffect(() => {
    if (liveCoords) {
      setIsIframeLoading(true);
    }
  }, [liveCoords]);

  // 1. Show loading ONLY when actively fetching AND we don't have coordinates yet
  if (isFetching && !liveCoords) {
    return (
      <div className="py-12 text-center text-slate-500 text-xs animate-pulse flex flex-col items-center justify-center gap-2 h-80 bg-slate-50 rounded-xl border border-slate-200">
        <Compass className="h-8 w-8 text-blue-500 animate-spin" />
        <span>Fetching live GPS signal...</span>
      </div>
    );
  }

  // 2. Show empty state when no fetch operation and no coordinates exist
  if (!liveCoords && !isFetching) {
    return (
      <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center h-80 bg-slate-50 rounded-xl border border-slate-200">
        <MapPin className="mx-auto h-8 w-8 text-slate-300 mb-2" />
        No live location stream active. Click <strong>Fetch Live Location</strong> to request current coordinates.
      </div>
    );
  }

  const { lat, lng, timestamp } = liveCoords;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

  return (
    <div className="space-y-4">
      {/* Live Badge Status Bar */}
      <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold">Live GPS Coordinates Active</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-700">
          Last Updated: {timestamp ? new Date(timestamp).toLocaleTimeString() : "Just now"}
        </span>
      </div>

      <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 relative">
        {/* HIGHLIGHT: Overlay spinner on top of iframe instead of replacing it */}
        {isIframeLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/90 text-xs text-slate-500 gap-2">
            <Compass className="h-7 w-7 text-blue-500 animate-spin" />
            <span>Rendering Map Stream...</span>
          </div>
        )}

        <iframe
          title="Live Device Map"
          width="100%"
          height="100%" 
          src={mapEmbedUrl}
          onLoad={() => setIsIframeLoading(false)}
        />
      </div>
    </div>
  );
}