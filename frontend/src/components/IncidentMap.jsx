import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useIncident } from "../context/IncidentContext";
import { useSidebar } from "../context/SidebarContext";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

function getSeverityColor(severity) {
  switch (severity?.toLowerCase()) {
    case "critical": return "#ef4444";
    case "high":     return "#f97316";
    case "medium":   return "#eab308";
    case "low":      return "#3b82f6";
    default:         return "#22c55e";
  }
}

function getSeverityRadius(severity) {
  switch (severity) {
    case "Critical": return 18;
    case "High":     return 14;
    case "Medium":   return 10;
    default:         return 7;
  }
}

// resizeTrigger changes whenever the layout shifts (e.g. sidebar collapse)
function ResizeMap({ resizeTrigger }) {
  const map = useMap();

  useEffect(() => {
    // fires on mount AND every time resizeTrigger changes
    // delay matches the sidebar's transition-all duration-300
    const timer = setTimeout(() => map.invalidateSize(), 320);
    return () => clearTimeout(timer);
  }, [map, resizeTrigger]);

  return null;
}

export default function IncidentMap({ incidents = [], fullHeight = false }) {
  const { setSelectedIncident } = useIncident();
  const { collapsed } = useSidebar();

  return (
    <div className={`${fullHeight ? "h-full" : "h-[500px]"} rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl`}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom
        className="h-full w-full z-0"
      >
        <ResizeMap resizeTrigger={collapsed} />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup chunkedLoading>
          {incidents
            .filter((i) => i.latitude !== 0 || i.longitude !== 0)
            .map((incident) => {
              const severity = incident.result?.severity || "Low";
              const color = getSeverityColor(severity);

              return (
                <CircleMarker
                  key={incident.id}
                  center={[incident.latitude, incident.longitude]}
                  radius={getSeverityRadius(severity)}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.7 }}
                  eventHandlers={{ click: () => setSelectedIncident(incident) }}
                >
                  <Popup>
                    <div className="space-y-2 min-w-[220px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{severity} Incident</span>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs text-white font-medium"
                          style={{ backgroundColor: color }}
                        >
                          {severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-3">{incident.incident}</p>
                      <div className="text-xs text-slate-500 space-y-0.5">
                        <div><strong>Location:</strong> {incident.locationName}</div>
                        <div><strong>Assigned:</strong> {incident.result?.assignee}</div>
                        <div><strong>Tags:</strong> {incident.result?.tags?.join(", ")}</div>
                        <div><strong>Created:</strong> {new Date(incident.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}