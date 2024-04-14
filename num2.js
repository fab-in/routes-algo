import React, { useState } from "react";
import { View, Button, Text, TextInput } from "react-native";
import axios from "axios";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

// Mock data for metro stations
const metroStations = [
  { name: "Metro Station A", latitude: 9.9953, longitude: 76.3116 },
  { name: "Metro Station B", latitude: 9.9903, longitude: 76.3042 },
  // Add more metro stations as needed
];

const App = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState(null);

  const getCoordinatesAndRoutes = async () => {
    try {
      // Get origin and destination coordinates
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

      // Find nearest metro stations to origin and destination
      const nearestMetroToOrigin = findNearestMetroStation(originCoordinates);
      const nearestMetroToDestination = findNearestMetroStation(destinationCoordinates);

      // Find bus routes from origin to nearest metro station and from nearest metro station to destination
      const originToMetroRoutes = await findBusRoutes(originCoordinates, nearestMetroToOrigin);
      const metroToDestinationRoutes = await findBusRoutes(nearestMetroToDestination, destinationCoordinates);

      // Set the routes state
      setRoutes({ originToMetroRoutes, metroToDestinationRoutes });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Function to find nearest metro station
  const findNearestMetroStation = (coordinates) => {
    let minDistance = Number.MAX_VALUE;
    let nearestStation = null;
    for (const station of metroStations) {
      const distance = calculateDistance(coordinates, { latitude: station.latitude, longitude: station.longitude });
      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = station;
      }
    }
    return nearestStation;
  };

  // Function to find bus routes
  const findBusRoutes = async (originCoordinates, destinationCoordinates) => {
    // Implement bus route finding logic here
    return []; // Dummy implementation
  };

  // Function to calculate distance between two coordinates (in meters)
  const calculateDistance = (coord1, coord2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
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
      <Button title="Get Routes" onPress={getCoordinatesAndRoutes} />
      {routes && (
        <View>
          <Text>Origin to Nearest Metro Station:</Text>
          <Text>Origin: {origin}</Text>
          <Text>Nearest Metro Station: {routes.originToMetroRoutes.name}</Text>
          <Text>Bus Routes: {routes.originToMetroRoutes.busRoutes.join(', ')}</Text>
          <Text>-------------------------------------------------------------</Text>
          <Text>Nearest Metro Station to Destination:</Text>
          <Text>Nearest Metro Station: {routes.metroToDestinationRoutes.name}</Text>
          <Text>Destination: {destination}</Text>
          <Text>Bus Routes: {routes.metroToDestinationRoutes.busRoutes.join(', ')}</Text>
        </View>
      )}
    </View>
  );
};

export default App;