import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import React from "react";
import "./map.css";
import { GeoCard } from "./Getlocation";
import { HotChocolate } from "../../interfaces";
import { Overlay } from "./Overlay";
export default function FavoritesMap() {
  // Default coordinates set to Oslo central station
  let coords = GeoCard();
  const zoom: number = 15;
  const position: [number, number] = coords;
  const icon: L.DivIcon = L.divIcon({
    className: "hot-chocolate-icon",
    iconSize: [30, 30],
    iconAnchor: [0, 0],
    popupAnchor: [15, 0],
  });
  const list: HotChocolate[] = [
    {
      productName: "Varm belgisk sjokolade",
      englishProductName: "Belgian hot chocolate",
      vendor: "Steam kaffebar",
      location: "Jernbanetorget 1, Østbanehallen",
      lat: 59.91088362120013,
      lon: 10.752799203777597,
    },
    {
      productName: "Varm sjokolade",
      englishProductName: "Hot chocolate",
      vendor: "Kaffebrenneriet",
      location: "Karl Johans gate 7, Arkaden",
      lat: 59.91181003626315,
      lon: 10.747782602301388,
    },
    {
      productName: "Sjokolade på pinne",
      englishProductName: "Hot chocolate on a stick",
      vendor: "Espresso House",
      location: "Jernbanetorget 1, Østbanehallen",
      lat: 59.91201090441835,
      lon: 10.751298468298101,
      description: "Seasonally available",
    },
  ];
  const basemapsDict = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    hot: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
    cycle: "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
  };
  const basemap = "osm";

  return (
    <div id="mapid">
      <MapContainer
      zoomControl={false}
        style={{display: 'flex', height: "100%", width: "100%", alignContent: 'center' }}
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Overlay basemap={basemapsDict.osm} />

        {list.map((item, index) => (
          <Marker
            icon={icon}
            key={index}
            position={[item.lat, item.lon]}
            title={`${item.englishProductName} at ${item.vendor}`}
          >
            <Popup>
              <strong>
                {item.englishProductName} at {item.vendor}
              </strong>
              <br />
              <p>
                Look for <strong>{item.productName}</strong> on the menu.
              </p>
              <p>{item.location}</p>
              {item.description && <em>{item.description}</em>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
