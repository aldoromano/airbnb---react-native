import { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import { ActivityIndicator, Dimensions } from "react-native";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { AntDesign } from "@expo/vector-icons";

import axios from "axios";

export default function AroundMeScreen() {
  const latitudeParisND = 48.8529371;
  const longitudeParisND = 2.3500501;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();

  const [error, setError] = useState();
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [coords, setCoords] = useState();

  useEffect(() => {
    const askPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});

        const obj = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCoords(obj);
      } else {
        setError(true);
      }

      setIsLoadingAuth(false);
    };

    const loadData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/around?latitude=${latitudeParisND}&longitude=${longitudeParisND}`
        );

        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };

    askPermission();
    loadData();
  }, [latitudeParisND, longitudeParisND]);

  return isLoadingAuth ? (
    <ActivityIndicator size="large" color="purple" style={{ marginTop: 100 }} />
  ) : error ? (
    <Text>Permission refusée</Text>
  ) : isLoading ? (
    <ActivityIndicator size="large" color="purple" style={{ marginTop: 100 }} />
  ) : (
    <View style={styles.mainContainer}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <View style={styles.containerMap}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: latitudeParisND,
            longitude: longitudeParisND,

            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          }}
          showsUserLocation={true}
        >
          {data.map((room, index) => {
            console.log("bcl -> ", index);

            return (
              <Marker
                key={room._id}
                coordinate={{
                  latitude: room.location[1],
                  longitude: room.location[0],
                }}
                title={room.title}
                description={room.description}
                // image={<AntDesign name="flag" size={24} color="black" />}
              />
            );
          })}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    flex: 1,
  },

  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },

  containerMap: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    // height: 400,
    // width: 400,
  },
});
