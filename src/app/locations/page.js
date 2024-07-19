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
// import "./styles.css"; // Import your CSS file

const center = {
  lat: 36.30059,
  lng: -85.6918,
};

const locations = [
  { name: "New York", position: { lat: 40.712776, lng: -74.005974 } },
  {
    name: "Middletown Township",
    position: { lat: 40.396778, lng: -74.118774 },
  },
  { name: "Brick Township", position: { lat: 40.058323, lng: -74.137725 } },
  { name: "Hamilton", position: { lat: 40.232051, lng: -74.743053 } },
  { name: "Trenton", position: { lat: 40.217052, lng: -74.742935 } },
  { name: "Ewing Township", position: { lat: 40.269779, lng: -74.799862 } },
  { name: "BrideGeboro", position: { lat: 40.223213, lng: -74.908273 } },
];

const Map = () => {
  const mapSelector = useSelector((state) => state.map)[0];
  const markers = mapSelector && mapSelector;
  console.log("Markers from state: ", markers);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
  });

  const [map, setMap] = React.useState(null);
  const [selectedMarker, setSelectedMarker] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    console.log("Map Will load After loading the bars:");
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    console.log("Map unmounted");
    setMap(null);
  }, []);

  const handleMarkerClick = (marker) => {
    console.log("Marker Clicked:", marker);
    setSelectedMarker(marker);
  };

  useEffect(() => {
    console.log("Map isLoaded:", isLoaded);
    console.log("Google Map API Key:", googleMapsApiKey);
  }, [isLoaded, googleMapsApiKey]);

  return isLoaded ? (
    <div className="w-1000 h-1000">
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          minHeight: "100vh",
        }}
        center={center}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          gestureHandling: "greedy",
          zoom: 9.3,
          minZoom: 2.0,
          maxZoom: 5.0,
        }}
      >
        {locations.map((location, index) => (
          <MarkerF
            key={index}
            position={location.position}
            icon={{
              scaledSize: { width: 40, height: 40 },
            }}
            onClick={() => handleMarkerClick(location)}
          >
            {selectedMarker && selectedMarker.name === location.name && (
              <InfoWindow
                position={location.position}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="info-window">
                  <h3>{selectedMarker.name}</h3>
                  <p>{`Lat: ${selectedMarker.position.lat}, Lng: ${selectedMarker.position.lng}`}</p>
                </div>
              </InfoWindow>
            )}
          </MarkerF>
        ))}

        <MarkerClustererF>
          {(clusterer) =>
            markers &&
            markers.map((marker) => {
              const position = {
                lat: marker.geoCode[0].geometry.location.lat,
                lng: marker.geoCode[0].geometry.location.lng,
              };
              console.log("Marker Position:", position);
              return (
                <MarkerF
                  onClick={() => handleMarkerClick(marker)}
                  position={position}
                  icon={{
                    url: marker.profile,
                    scaledSize: { width: 40, height: 40 },
                  }}
                  key={marker.id}
                >
                  {selectedMarker && selectedMarker.id === marker.id && (
                    <InfoWindow
                      position={selectedMarker.position}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="info-window">
                        <h3>{selectedMarker.name}</h3>
                        <p>{selectedMarker.address}</p>
                      </div>
                    </InfoWindow>
                  )}
                </MarkerF>
              );
            })
          }
        </MarkerClustererF>

        {console.log("Selected Marker:", selectedMarker)}
      </GoogleMap>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <span className="loading-lg loading loading-bars bg-[#1E328F] custom-loading-bars"></span>
    </div>
  );
};

export default React.memo(Map);
