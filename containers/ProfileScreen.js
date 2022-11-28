import { useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/core";
import * as ImagePicker from "expo-image-picker";
import {
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfileScreen({ id, setId, setToken, token }) {
  // const { params } = useRoute();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("id -> ", id, " Token -> ", token);
    const loadData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEmail(response.data.email);
        setUserName(response.data.username);
        setDescription(response.data.description);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };

    loadData();
  }, [id]);

  const [selectedPicture, setSelectedPicture] = useState(null);
  const [isPhotoSending, setIsPhotoSending] = useState(false);

  const getPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log(status);
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync();
      // console.log(result.assets);

      setSelectedPicture(result.assets[0].uri);
    } else {
      console.log("Permission refusée");
    }
  };

  const getPermissionAndTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    console.log(status);
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      // console.log(result.assets);

      setSelectedPicture(result.assets[0].uri);
    } else {
      console.log("Permission refusée");
    }
  };

  // MAJ profil utilisateur
  const submit = async () => {
    setError("");
    // FRONT on vérifie que tous les champs soient renseignés
    if (!email || !userName || !description) {
      setError("Remplir tous les champs");
      return;
    }

    try {
      const tab = selectedPicture.split(".");
      const formData = new FormData();
      formData.append("photo", {
        uri: selectedPicture,
        name: `my-pic.${tab[1]}`,
        type: `image/${tab[1]}`,
      });

      const response = await axios.put(
        "https://express-airbnb-api.herokuapp.com/user/upload_picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log("error rsp -> ", error.response);
      setError("MAJ Photo  refusée");
    }

    try {
      const response = await axios.put(
        "https://express-airbnb-api.herokuapp.com/user/update",
        {
          email: email,
          username: userName,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigation.navigate("Home");
    } catch (error) {
      setError("MAJ refusée");
      console.log(error.response.data);
    }
  };

  // Affichage du composant
  return isLoading ? (
    <ActivityIndicator></ActivityIndicator>
  ) : (
    <ScrollView>
      <View style={styles.mainContainer}>
        {/* <Text>user id : {params.userId}</Text> */}
        {/* <Text>user id : {id}</Text> */}

        <Button
          title="Accéder à la galerie du téléphone"
          onPress={getPermission}
        />
        <Button
          title="Prendre une photo avec l'appareil"
          onPress={getPermissionAndTakePhoto}
        />

        {selectedPicture && (
          <Image
            source={{ uri: selectedPicture }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 150,
              borderColor: "red",
            }}
          />
        )}

        <Text>Email: </Text>
        <TextInput
          style={StyleSheet.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email"
          autoCapitalize="none"
        />

        <Text>Username: </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setUserName(text)}
          value={userName}
          placeholder="username"
          autoCapitalize="none"
        />

        <Text>Description: </Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setDescription(text)}
          value={description}
          placeholder="passwdescriptionord"
          autoCapitalize="none"
        />

        <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
        <TouchableOpacity style={styles.btn} onPress={submit}>
          <Text>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setToken(null);
            setId(null);
          }}
        >
          <Text>Log out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 25,
  },

  logo: {
    width: 100,
    height: 100,
  },

  input: {
    borderColor: "#ffbac0",
    borderWidth: 2,
    height: 30,
    width: 300,
    marginTop: 10,
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
