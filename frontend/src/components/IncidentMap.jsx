import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useIncident } from "../context/IncidentContext";
import { useSidebar } from "../context/SidebarContext";
import { useTheme } from "../context/ThemeContext";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

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

const SEVERITY_RANK = { Critical: 4, High: 3, Medium: 2, Low: 1 };

// Picks the worst severity present in a cluster, so the cluster color
// always signals "the most urgent thing inside me"
function worstSeverityColor(markers) {
  let worst = "Low";
  markers.forEach((m) => {
    const sev = m.options?.severity || "Low";
    if ((SEVERITY_RANK[sev] || 0) > (SEVERITY_RANK[worst] || 0)) worst = sev;
  });
  return getSeverityColor(worst);
}

function createClusterIcon(cluster) {
  const count = cluster.getChildCount();
  const color = worstSeverityColor(cluster.getAllChildMarkers());

  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 100%; height: 100%;
        border-radius: 9999px;
        display: flex; align-items: center; justify-content: center;
        color: white; font-weight: 700; font-size: 13px;
        border: 3px solid rgba(255,255,255,0.85);
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      ">${count}</div>
    `,
    className: "custom-cluster-icon",
    iconSize: L.point(40, 40, true),
  });
}

// resizeTrigger changes whenever the layout shifts (e.g. sidebar collapse)
function ResizeMap({ resizeTrigger }) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 320);
    return () => clearTimeout(timer);
  }, [map, resizeTrigger]);

  return null;
}

// Fits the map view to show all incident markers, with sensible fallbacks
function FitToIncidents({ incidents }) {
  const map = useMap();

  useEffect(() => {
    const validPoints = incidents
      .filter((i) => i.latitude !== 0 || i.longitude !== 0)
      .map((i) => [i.latitude, i.longitude]);

    if (validPoints.length === 0) {
      // No located incidents — keep the default world view
      map.setView([20, 0], 2);
      return;
    }

    if (validPoints.length === 1) {
      // Single incident — center on it at a reasonable street/city zoom
      map.setView(validPoints[0], 8);
      return;
    }

    // Multiple incidents — fit bounds to show them all, with padding
    const bounds = L.latLngBounds(validPoints);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
  }, [map, incidents]);

  return null;
}

const TILE_LAYERS = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
};

function Legend() {
  const items = [
    { label: "Critical", color: "#ef4444" },
    { label: "High",     color: "#f97316" },
    { label: "Medium",   color: "#eab308" },
    { label: "Low",      color: "#3b82f6" },
  ];

  return (
    <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-lg space-y-1">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
          {item.label}
        </div>
      ))}
    </div>
  );
}

export default function IncidentMap({ incidents = [], fullHeight = false }) {
  const { setSelectedIncident } = useIncident();
  const { collapsed } = useSidebar();
  const { darkMode } = useTheme();

  const tiles = darkMode ? TILE_LAYERS.dark : TILE_LAYERS.light;

  return (
    <div className={`relative ${fullHeight ? "h-full" : "h-[500px]"} rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl`}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full z-0 bg-slate-100 dark:bg-slate-950"
      >
        <ResizeMap resizeTrigger={collapsed} />
        <FitToIncidents incidents={incidents} />
        <ZoomControl position="topright" />

        <TileLayer
          key={darkMode ? "dark" : "light"} // forces a clean swap when the theme flips
          attribution={tiles.attribution}
          url={tiles.url}
        />

        <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterIcon}>
          {incidents
            .filter((i) => i.latitude !== 0 || i.longitude !== 0)
            .map((incident) => {
              const severity = incident.result?.severity || "Low";
              const color    = getSeverityColor(severity);

              return (
                <CircleMarker
                  key={incident.id}
                  center={[incident.latitude, incident.longitude]}
                  radius={getSeverityRadius(severity)}
                  severity={severity}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 2,
                    fillColor: color,
                    fillOpacity: 0.85,
                  }}
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
                      <button
                        onClick={() => setSelectedIncident(incident)}
                        className="w-full mt-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition"
                      >
                        View full details
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      <Legend />
    </div>
  );
}