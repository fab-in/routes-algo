import React, { useState } from "react";
import { View, Button, Text, TextInput } from "react-native";
import axios from "axios";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const App = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState(null);

  const getCoordinatesAndRoutes = async () => {
    try {
      // Get origin coordinates
      const originResponse = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: origin,
            key: "AIzaSyDxcgmpNTtROwth6FMxilVQCUZ-D8U8384",
          },
        }
      );

      const originCoordinates =
        originResponse.data.results[0].geometry.location;

      // Get destination coordinates
      const destinationResponse = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: destination,
            key: "AIzaSyDxcgmpNTtROwth6FMxilVQCUZ-D8U8384",
          },
        }
      );

      const destinationCoordinates =
        destinationResponse.data.results[0].geometry.location;

      // Get route details
      const routeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${originCoordinates.lat},${originCoordinates.lng}&destination=${destinationCoordinates.lat},${destinationCoordinates.lng}&alternatives=true&key=AIzaSyDxcgmpNTtROwth6FMxilVQCUZ-D8U8384`
      );

      const routeDetails = routeResponse.data.routes;
      setRoutes(routeDetails);
    } catch (error) {
      console.error("Error fetching data: ", error);
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
      <Button title="Get Routes" onPress={getCoordinatesAndRoutes} />
      {routes && routes.map((route, index) => (
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
  );
};

export default App;