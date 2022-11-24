import { AntDesign } from "@expo/vector-icons";
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { ActivityIndicator, Dimensions } from "react-native";
import * as Location from "expo-location";
import MapView from "react-native-maps";

import axios from "axios";
import Swiper from "react-native-swiper";

export default function RoomScreen() {
  const { params } = useRoute();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();

  const [error, setError] = useState();
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [coords, setCoords] = useState();

  //console.log("params -> ", params.id);
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
          `https://express-airbnb-api.herokuapp.com/rooms/${params.id}`
        );

        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };

    askPermission();
    loadData();
  }, [params.id]);

  return isLoadingAuth ? (
    <ActivityIndicator size="large" color="purple" style={{ marginTop: 100 }} />
  ) : error ? (
    <Text>Permission refusée</Text>
  ) : isLoading ? (
    <ActivityIndicator size="large" color="purple" style={{ marginTop: 100 }} />
  ) : (
    <View style={styles.mainContainer}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      {/* <ScrollView style={styles.imageContainer} horizontal> */}
      <Swiper
        style={styles.wrapper}
        dotColor="salmon"
        activeDotColor="red"
        autoplay
        pagination
      >
        {data.photos.map((item, index) => {
          return (
            <View style={styles.slide} key={index}>
              <Image
                key={index}
                // style={styles.photoFlat}
                style={{ height: "100%", width: "100%" }}
                source={{ uri: item.url }}
              />
            </View>
          );
        })}
      </Swiper>

      <View style={styles.containerMap}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: data.location[1],
            longitude: data.location[0],
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          }}
          showsUserLocation={true}
        />
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

  photoFlat: {
    width: 300,
    height: 300,
  },

  wrapper: {
    height: 300,
  },

  slide: {
    height: 300,
  },

  containerMap: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  map: {
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
    height: 350,
    width: 400,
  },
});
