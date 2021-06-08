import { LatLng } from "leaflet";
import React, { useEffect, useState } from "react";

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export const GeoCard = () => {
  const [lat, setLat] = useState("");
  const [lang, setLang] = useState("");

  const success = (pos: { coords: any }) => {
    var crd = pos.coords;
    setLat(crd.latitude);
    setLang(crd.longitude);
  };

  const error = (err: { code: any; message: any }) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);
  var latlngs: [number, number] = [
    45.51, -122.68
]  
return  latlngs
};
