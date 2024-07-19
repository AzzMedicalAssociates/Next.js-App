"use client";
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  MarkerClustererF,
  InfoWindow,
} from "@react-google-maps/api";

import { useSelector } from "react-redux";

const center = {
  lat: 36.30059,
  lng: -85.6918,
};

const Map = () => {
  const mapSelector = useSelector((state) => state.map)[0];

  const markers = mapSelector && mapSelector;

  console.log("Markers: ", markers);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
  });

  const [map, setMap] = React.useState(null);
  const [selectedMarker, setSelectedMarker] = React.useState("");

  const onLoad = React.useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.setZoom(bounds);
      setMap(map);
    },
    [center]
  );

  const onUnmount = React.useCallback(
    function callback(map) {
      map.setZoom(1);
      setMap(null);
    },
    [center]
  );

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
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
          maxZomm: 6.0,
          // mapTypeId: "terrain",
        }}
      >
        <MarkerClustererF>
          {(clusterer) =>
            markers &&
            markers.map((marker) => {
              return (
                <MarkerF
                  onClick={() => handleMarkerClick(marker)}
                  position={marker.geoCode[0].geometry.location}
                  icon={{
                    url: marker.profile,
                    scaledSize: { width: 40, height: 40 },
                  }}
                  key={marker.id}
                  className="absolute z-1 cursor-pointer"
                  clusterer={clusterer}
                >
                  {selectedMarker && (
                    <InfoWindow
                      position={marker.geoCode[0].geometry.location}
                      onCloseClick={() => setSelectedMarker("")}
                    >
                      <div className="flex flex-col gap-2 items-center justify-center overflow-hidden w-40">
                        <h3>{selectedMarker && selectedMarker.name}</h3>
                        <p>{selectedMarker && selectedMarker.address}</p>
                      </div>
                    </InfoWindow>
                  )}
                </MarkerF>
              );
            })
          }
        </MarkerClustererF>

        {console.log(selectedMarker && selectedMarker)}
      </GoogleMap>
    </div>
  ) : (
    <span className="loading bg-[#1E328F] loading-bars loading-lg"></span>
  );
};

export default React.memo(Map);
