import { MapPin, Navigation, Compass } from "lucide-react";

export default function LiveMapTab({ liveCoords, isFetching }) {
  if (!liveCoords && !isFetching) {
    return (
      <div className="py-12 text-center text-slate-500 text-xs">
        <MapPin className="mx-auto h-8 w-8 text-slate-300 mb-2" />
        No live location stream active. Click <strong>Fetch Live Location</strong> to request current coordinates.
      </div>
    );
  }

  if (isFetching && !liveCoords) {
    return (
      <div className="py-12 text-center text-slate-500 text-xs animate-pulse flex flex-col items-center gap-2">
        <Compass className="h-8 w-8 text-blue-500 animate-spin" />
        <span>Requesting live location from device GPS...</span>
      </div>
    );
  }

  const { lat, lng, timestamp } = liveCoords;
  // Google Maps embed URL or your Leaflet/Mapbox component
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


      {/* Embedded Live Map Container */}
      <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
        <iframe
          title="Live Device Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={mapEmbedUrl}
        />
      </div>
    </div>
  );
}