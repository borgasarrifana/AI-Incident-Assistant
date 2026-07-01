import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup
} from "react-leaflet";

import MarkerClusterGroup
from "react-leaflet-cluster";

export default function IncidentGeoMap({
  history
}) {

  return (

    <div className="
      h-[600px]
      rounded-3xl
      overflow-hidden
      border border-slate-800
    ">

      <MapContainer
        center={[41.1579,-8.6291]}
        zoom={6}
        style={{
          height:"100%",
          width:"100%"
        }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup>

          {history
            .filter(
              i =>
                i.lat &&
                i.lng
            )
            .map((incident) => (

            <CircleMarker
              key={incident.id}
              center={[
                incident.lat,
                incident.lng
              ]}
              radius={
                incident.result?.severity === "Critical"
                ? 18
                : 10
                }
              color={
                incident.result
                  ?.severity === "Critical"
                  ? "#ef4444"
                  : incident.result
                      ?.severity === "High"
                  ? "#f97316"
                  : incident.result
                      ?.severity === "Medium"
                  ? "#eab308"
                  : "#3b82f6"
              }
            >

              <Popup>

                <div>

                  <div>
                    <strong>
                      Severity:
                    </strong>{" "}
                    {
                      incident.result
                        ?.severity
                    }
                  </div>

                  <div>
                    {
                      incident.locationName
                    }
                  </div>

                  <div>
                    {
                      incident.incident
                    }
                  </div>

                </div>

              </Popup>

            </CircleMarker>

          ))}

        </MarkerClusterGroup>

      </MapContainer>

    </div>

  );

}