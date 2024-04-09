import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import axios from "axios";

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


        const headers = {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": "AIzaSyDxcgmpNTtROwth6FMxilVQCUZ-D8U8384",
          "X-Goog-FieldMask": "routes.localizedValues,routes.travel_advisory.transitFare,routes.legs.steps.transitDetails"
        };
  
        // Set up body
        const body = {
          origin: {
            location: {
              latLng: {
                latitude: originCoordinates.lat,
                longitude: originCoordinates.lng
              }
            }
          },
          destination: {
            location: {
              latLng: {
                latitude: destinationCoordinates.lat,
                longitude: destinationCoordinates.lng
              }
            }
          },
          travelMode:"TRANSIT",
          computeAlternativeRoutes: true,
          routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false
          },
          languageCode: "en-US",
          units: "IMPERIAL"
        };
  
      // Get route details
      const routeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${originCoordinates.lat},${originCoordinates.lng}&destination=${destinationCoordinates.lat},${destinationCoordinates.lng}&key=AIzaSyDxcgmpNTtROwth6FMxilVQCUZ-D8U8384`,
        {
          params: body,
          headers: headers
        }
      );

      const routeDetails = routeResponse.data.routes[0];
      console.log(routeResponse.data.routes[0].legs[0]);

      // Set the routes state
      setRoutes(routeDetails);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput
        style={{
          height: 40,
          width: 200,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
        placeholder="Origin"
        value={origin}
        onChangeText={(text) => setOrigin(text)}
      />
      <TextInput
        style={{
          height: 40,
          width: 200,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
        placeholder="Destination"
        value={destination}
        onChangeText={(text) => setDestination(text)}
      />
      <Button title="Get Routes" onPress={getCoordinatesAndRoutes} />
      {routes && (
        <View>
          <Text>Route Details:</Text>
          <View>
        
              <View>
                <Text>{routes?.legs[0].start_address}</Text>
                <Text>{routes?.legs[0].end_address}</Text>
              </View>
       
          </View>
        </View>
      )}
    </View>
  );
};

export default App;
