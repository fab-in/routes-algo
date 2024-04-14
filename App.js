import React, { useState } from "react";
import { View, Button, Text, TextInput } from "react-native";
import axios from "axios";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const App = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState(null);

  // Function to find nearest metro station
  const findNearestMetroStation = (coordinates) => {
    // Mock data for metro stations
    const metroStations = [
      { name: "Aluva", lat: 10.1099872, lng: 76.3495149 },
      { name: "Pulinchodu", lat: 10.0951, lng: 76.3466 },
      { name: "Companypady", lat: 10.0873, lng: 76.3428 },
      { name: "Ambattukavu", lat: 10.0792806, lng: 76.3388894 },
      { name: "Muttom", lat: 10.0727011, lng: 76.33375 },
      { name: "Kalamassery", lat: 10.0630188, lng: 76.3279715 },
      { name: "CUSAT", lat: 10.0468491, lng: 76.3182738 },
      { name: "Pathadipalam", lat: 10.0361, lng: 76.3144 },
      { name: "Edapally", lat: 10.025263, lng: 76.3083641 },
      { name: "Changampuzha Park", lat: 10.0152041, lng: 76.3023872 },
      { name: "Palarivattom", lat: 10.0063373, lng: 76.3048456 },
      { name: "JLN Stadium", lat: 10.0003003, lng: 76.2991852 },
      { name: "Kaloor", lat: 9.9943, lng: 76.2914 },
      { name: "Town Hall", lat: 9.9914, lng: 76.2884 },
      { name: "MG Road", lat: 9.983496, lng: 76.282263 },
      { name: "Maharaja’s College", lat: 9.9732357, lng: 76.2850733 },
      { name: "Ernakulam South", lat: 9.9685, lng: 76.2893 },
      { name: "Kadavanthra", lat: 9.966593, lng: 76.298074 },
      { name: "Elamkulam", lat: 9.9672125, lng: 76.3086071 },
      { name: "Vyttila", lat: 9.9673739, lng: 76.3204215 },
      { name: "Thaikoodam", lat: 9.960079, lng: 76.323483 },
      { name: "Pettah", lat: 9.9525568, lng: 76.3300456 },
      { name: "Vadakkekotta", lat: 9.952771, lng: 76.339277 },
      { name: "SN Junction", lat: 9.954662, lng: 76.345919 },
      { name: "Thrippunithura", lat: 9.9504507, lng: 76.3517069 },
    ];

    let minDistance = Number.MAX_VALUE;
    let nearestStation = null;
    for (const station of metroStations) {
      const distance = calculateDistance(coordinates, station);
      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = station;
      }
    }
    return nearestStation;
  };

  // Function to calculate distance between two coordinates (in meters)
  const calculateDistance = (coord1, coord2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (coord1.lat * Math.PI) / 180;
    const φ2 = (coord2.lat * Math.PI) / 180;
    const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Function to integrate route finding logic
  const findRoutes = async () => {
    try {
      const originResponse = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        { params: { address: origin, key: "AIzaSyDxcgmpNTtROwth6FMxilVQCUZ-D8U8384" } }
      );
      const originCoordinates = originResponse.data.results[0].geometry.location;

      const destinationResponse = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        { params: { address: destination, key: "AIzaSyDxcgmpNTtROwth6FMxilVQCUZ-D8U8384" } }
      );
      const destinationCoordinates = destinationResponse.data.results[0].geometry.location;

      const nearestMetroToOrigin = findNearestMetroStation(originCoordinates);
      const nearestMetroToDestination = findNearestMetroStation(destinationCoordinates);

      // Get route details
      const routeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${originCoordinates.lat},${originCoordinates.lng}&destination=${destinationCoordinates.lat},${destinationCoordinates.lng}&alternatives=true&key=AIzaSyDxcgmpNTtROwth6FMxilVQCUZ-D8U8384`
      );

      const routeDetails = routeResponse.data.routes;

      setRoutes({ 
        nearestMetroToOrigin, 
        nearestMetroToDestination,
        routeDetails
      });
    } catch (error) {
      console.error("Error finding routes: ", error);
    }
  };

  return (
    <View style={{ flex:1, padding: 20 }}>
      <GooglePlacesAutocomplete
        placeholder='Enter Origin'
        onPress={(data, details = null) => {
          setOrigin(data.description);
        }}
        query={{
          key: 'AIzaSyDxcgmpNTtROwth6FMxilVQCUZ-D8U8384',
          language: 'en',
        }}
      />
      <GooglePlacesAutocomplete
        placeholder='Enter Destination'
        onPress={(data, details = null) => {
          setDestination(data.description);
        }}
        query={{
          key: 'AIzaSyDxcgmpNTtROwth6FMxilVQCUZ-D8U8384',
          language: 'en',
        }}
      />
      <Button title="Get Routes" onPress={findRoutes} />
      {routes && (
        <View>
          <Text>Origin to Nearest Metro Station:</Text>
          <Text>Origin: {origin}</Text>
          <Text>Nearest Metro Station: {routes.nearestMetroToOrigin.name}</Text>
          <Text>-------------------------------------------------------------</Text>
          <Text>Nearest Metro Station to Destination:</Text>
          <Text>Nearest Metro Station: {routes.nearestMetroToDestination.name}</Text>
          <Text>Destination: {destination}</Text>
          <Text>-------------------------------------------------------------</Text>
          <Text>Routes:</Text>
          {routes.routeDetails.map((route, index) => (
            <View key={index}>
              <Text>Route Details {index + 1}:</Text>
              <Text>Start Address: {route?.legs[0].start_address}</Text>
              <Text>End Address: {route?.legs[0].end_address}</Text>
              <Text>Total Distance: {route?.legs[0].distance.text}</Text>
              <Text>Total Time: {route?.legs[0].duration.text}</Text>
              <Text>-------------------------------------------------------------</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default App;
