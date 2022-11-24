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
import { ActivityIndicator } from "react-native";

import axios from "axios";

export default function RoomScreen() {
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    const loadData = async () => {
      try {
        // console.log(
        //   "useEffect",
        //   `https://express-airbnb-api.herokuapp.com/rooms/${route.params.id}`
        // );

        // const response = await axios.get(
        //   `https://express-airbnb-api.herokuapp.com/rooms/${route.params.id}`
        // );
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/58ff73cc1765a9979391c532`
        );

        setIsLoading(false);
        setData(response.data);

        //console.log("contenu data -> ", response.data);
      } catch (error) {
        console.log("Error !!! ->", error.data.message);
        console.log(error.message);
      }
    };

    loadData();
  }, [route.params.id]);

  //   if (isLoading === true) {
  //     // We haven't finished checking for the token yet
  //     return null;
  //   }
  return isLoading ? (
    <ActivityIndicator size="large" color="purple" style={{ marginTop: 100 }} />
  ) : (
    <View style={styles.mainContainer}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <ScrollView style={styles.imageContainer}>
        {data.photos.map((item) => {
          //console.log("Bcl -> ", data.photos);
          return (
            <Image
              key={item._id}
              style={styles.photoFlat}
              source={{ uri: item.url }}
            />
          );
        })}
      </ScrollView>
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
    height: 200,
  },
});
