import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const PAKISTAN_CENTER = [30.3753, 69.3451];
const PAKISTAN_DEFAULT_ZOOM = 6;

const activeIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const inactiveIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "grayscale opacity-60",
});

const isDeviceActive = (device) => Boolean(device.isOnline);

const createClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  const pinColor = count >= 10 ? "#dc2626" : count >= 5 ? "#d97706" : "#2563eb";

  return L.divIcon({
    html: `
      <div class="w-8 h-10 drop-shadow-md">
        <svg viewBox="0 0 24 32" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z" fill="${pinColor}"/>
          <circle cx="12" cy="11" r="7" fill="#ffffff"/>
          <text 
            x="12" 
            y="11" 
            text-anchor="middle" 
            dominant-baseline="central" 
            fill="#1e293b" 
            font-size="9.5" 
            font-weight="bold" 
            font-family="sans-serif"
          >
            ${count}
          </text>
        </svg>
      </div>
    `,
    className: "",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
  });
};

export default function DeviceMap({ devices }) {
  const navigate = useNavigate();
  const withLocation = devices.filter((d) => d.lastKnownLocation?.lat);

  const clusterKey = withLocation
    .map((d) => `${d._id}-${d.isOnline}-${d.lastKnownLocation.lat}-${d.lastKnownLocation.lng}`)
    .join("|");

  return (
    // HIGHLIGHT: Isolated stacking context using relative z-0 and responsive height (h-80 sm:h-125)
    <div className="relative z-0 h-80 sm:h-125 w-full rounded-lg overflow-hidden border border-slate-200">
      {/* Legend Box */}
      <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-xs rounded-md shadow-sm border border-slate-200 px-3 py-2 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span className="text-slate-700">Active (Socket connected)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          <span className="text-slate-700">Inactive</span>
        </div>
      </div>

      <MapContainer 
        center={PAKISTAN_CENTER} 
        zoom={PAKISTAN_DEFAULT_ZOOM} 
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MarkerClusterGroup
          key={clusterKey}
          chunkedLoading
          iconCreateFunction={createClusterIcon}
          maxClusterRadius={30}
          disableClusteringAtZoom={10}
        >
          {withLocation.map((device) => {
            const active = isDeviceActive(device);
            return (
              <Marker
                key={device._id}
                position={[device.lastKnownLocation.lat, device.lastKnownLocation.lng]}
                icon={active ? activeIcon : inactiveIcon}
              >
                <Popup>
                  <div className="p-1 space-y-1.5">
                    <button
                      onClick={() => navigate(`/devices/${device._id}`)}
                      className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline text-left block"
                    >
                      {device.employeeName || "Unnamed Device"} →
                    </button>
                    
                    <div className="text-xs text-slate-600 space-y-0.5">
                      <div>Status: {device.isOnline ? "🟢 Online" : "🔴 Offline"}</div>
                      <div>Compliance: {device.isCompliant ? "Compliant" : "Non-Compliant"}</div>
                      <div>Last ping: {device.lastPingAt ? new Date(device.lastPingAt).toLocaleString() : "Never"}</div>
                    </div>

                    <button
                      onClick={() => navigate(`/devices/${device._id}`)}
                      className="mt-2 w-full px-2 py-1 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 transition-colors"
                    >
                      View Device Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}