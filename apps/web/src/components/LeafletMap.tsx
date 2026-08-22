'use client';
import * as React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export type MapPoint = { id: string; name: string; note: string; lat: number; lng: number; size: number };

const EGYPT_CENTER: [number, number] = [26.6, 30.0];

/** Re-centres the map when the selected list item changes, without remounting the whole canvas. */
function FlyTo({ point }: { point: MapPoint | null }) {
  const map = useMap();
  React.useEffect(() => {
    if (point) map.flyTo([point.lat, point.lng], Math.max(map.getZoom(), 7), { duration: 0.6 });
  }, [point, map]);
  return null;
}

export default function LeafletMap({
  points, colour, hoverId, onHover, selected,
}: { points: MapPoint[]; colour: string; hoverId: string | null; onHover: (id: string | null) => void; selected: MapPoint | null }) {
  return (
    <MapContainer
      center={EGYPT_CENTER} zoom={6} minZoom={5} maxZoom={12}
      scrollWheelZoom
      className="h-full w-full"
      attributionControl
    >
      {/* CARTO's free dark basemap — no API key, no vendor contract. Real,
          live map tiles; the markers plotted on it remain Egypt One's own
          demo data (see the SourceBadge below the canvas). */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />
      <FlyTo point={selected} />
      {points.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.lat, p.lng]}
          radius={hoverId === p.id ? p.size + 2 : p.size}
          pathOptions={{
            color: colour, weight: hoverId === p.id ? 2 : 1,
            fillColor: colour, fillOpacity: hoverId === p.id ? 0.9 : 0.55,
          }}
          eventHandlers={{
            mouseover: () => onHover(p.id),
            mouseout: () => onHover(null),
          }}
        >
          <Tooltip direction="top" offset={[0, -6]} opacity={1}>
            <div className="text-[12px] font-semibold">{p.name}</div>
            <div className="text-[11px] opacity-80">{p.note}</div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
