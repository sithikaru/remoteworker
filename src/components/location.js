import React, { useState, useEffect } from "react";

const LocationComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if ("geolocation" in navigator) {
          // If geolocation is supported by the browser
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setError(null); // Reset any previous errors
        } else {
          // If geolocation is not available, fetch location from IP
          const ipLocationResponse = await fetch("https://ipinfo.io/json");
          const ipLocationData = await ipLocationResponse.json();

          const { loc } = ipLocationData;
          if (loc) {
            const [latitude, longitude] = loc.split(",");
            setUserLocation({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
            setError(null); // Reset any previous errors
          } else {
            setError("Unable to retrieve user location from IP.");
          }
        }
      } catch (error) {
        console.error("Error getting user location:", error.message);
        setUserLocation(null);
        setError(error.message); // Save the error message for display
      }
    };

    fetchLocation();
  }, []);

  return (
    <div>
      {userLocation ? (
        <p>
          Latitude: {userLocation.latitude}, Longitude: {userLocation.longitude}
        </p>
      ) : (
        <p>{error || "Unable to retrieve user location."}</p>
      )}
    </div>
  );
};

export default LocationComponent;
