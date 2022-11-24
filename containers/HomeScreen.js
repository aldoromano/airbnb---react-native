import { useNavigation } from "@react-navigation/core";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";

import {
  Button,
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms"
        );

        setIsLoading(false);
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    loadData();
  }, []);

  if (isLoading === true) {
    // We haven't finished checking for the token yet
    return null;
  }

  const renderItem = ({ item }) => {
    const tab = [];
    for (let i = 0; i < item.ratingValue; i++) {
      tab.push(i);
    }
    return (
      <View style={styles.photoBorder}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Room", { id: item._id })}
        >
          <Image
            style={styles.photoFlat}
            source={{ uri: item.photos[0].url }}
          />
        </TouchableOpacity>
        <View style={styles.photoTitleContainer}>
          <View style={styles.titleStarContainer}>
            <Text style={styles.titleFlat}>{item.title}</Text>
            <View style={styles.starContainer}>
              {tab.map((elem, index) => {
                return (
                  <AntDesign name="star" size={24} color="orange" key={index} />
                );
              })}
            </View>
          </View>
          <Image
            style={styles.photoAccount}
            source={{ uri: item.user.account.photo.url }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text>Welcome home!</Text>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="purple"
          style={{ marginTop: 100 }}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item._id)}
          // renderItem={({ photos }) => <Image source={photos[0]}></Image>}
          renderItem={renderItem}
        />
      )}

      <Button
        title="Go to Profile !!"
        onPress={() => {
          navigation.navigate("Profile", { userId: 123 });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    flex: 1,
    // marginVertical: 25,
  },

  logo: {
    width: 100,
    height: 100,
  },

  photoFlat: {
    width: 350,
    height: 150,
  },

  photoTitleContainer: {
    // marginTop: 10,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  TitleStarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  starContainer: {
    flexDirection: "row",
    // justifyContent: "space-evenly",
  },

  photoAccount: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },

  titleFlat: {
    // marginTop: 15,
    fontWeight: "bold",
  },

  btn: {
    borderColor: "#ffbac0",
    borderWidth: 3,
    height: 50,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    margin: 40,
    borderRadius: 10,
  },

  photoBorder: {
    borderBottomColor: "#ffbac0",
    borderBottomWidth: 1,
    height: 250,
    width: 350,
    alignItems: "center",
    justifyContent: "center",
  },
});
