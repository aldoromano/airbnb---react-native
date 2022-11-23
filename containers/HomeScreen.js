import { useNavigation } from "@react-navigation/core";
import { useState, useEffect } from "react";
import {
  Button,
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
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

  const renderItem = ({ item }) => (
    <View>
      <Image source={item.photos[0].url} />
      <Text>{console.log(item.photos[0].url)}</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text>Welcome home!</Text>

      {isLoading ? (
        <Text>Loading ... </Text>
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
    // marginVertical: 25,
  },

  logo: {
    width: 100,
    height: 100,
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
});
