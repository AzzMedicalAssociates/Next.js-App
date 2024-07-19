"use client";
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const center = {
  lat: 36.30059,
  lng: -85.6918,
};

const Map1 = () => {
  const mapSelector = useSelector((state) => state.map)[0];

  

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
  });

  const [map, setMap] = React.useState(0);
  const [selectedMarker, setSelectedMarker] = React.useState("");
  const [selectedProvider, setSelectedProvider] = React.useState(0);

  const onLoad = React.useCallback(
    function callback(map) {
      //const bounds = new window.google.maps.LatLngBounds(center);
      map.setZoom(1);
      setMap(map);
    },
    [center]
  );

  const onUnmount = React.useCallback(
    function callback(map) {
      map.setZoom(1);
      setMap(map);
    },
    [center]
  );

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleNextProvider = () => {
    const providers = groupedProviders[selectedMarker].providers;
    setSelectedProvider(
      (prevProvider) => (prevProvider + 1) % providers.length
    );
  };

  const handlePrevProvider = () => {
    const providers = groupedProviders[selectedMarker].providers;
    setSelectedProvider(
      (prevProvider) => (prevProvider - 1 + providers.length) % providers.length
    );
  };

  return isLoaded ? (
    <div className="w-full h-full static ">
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          minHeight: "85vh",
        }}
        center={center}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          gestureHandling: "greedy",
          zoom: 5.3,
          minZoom: 5.0,
          maxZoom: 20,
        }}
      >
      
      </GoogleMap>
    </div>
  ) : (
    <span className="loading bg-[#1E328F] loading-bars loading-lg"></span>
  );
};

export default React.memo(Map1);
