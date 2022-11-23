import {
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import axios from "axios";

export default function SignUpScreen({ setToken }) {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    // FRONT on vérifie que tous les champs soient renseignés
    if (!email || !password || !confirmPassword || !description) {
      setError("Remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mdp différents!");
      return;
    }

    try {
      const response = await axios.post(
        "https://express-airbnb-api.herokuapp.com/user/sign_up",
        {
          email: email,
          username: userName,
          password: password,
          description: description,
        }
      );

      setToken(response.data.token);
    } catch (error) {
      console.log(error.response.data);
    }
  };
  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />

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
          style={StyleSheet.input}
          onChangeText={(text) => setUserName(text)}
          value={userName}
          placeholder="username"
          autoCapitalize="none"
        />

        <Text>Password: </Text>
        <TextInput
          style={StyleSheet.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="password"
          autoCapitalize="none"
          secureTextEntry
        />

        <Text>Confirm assword: </Text>
        <TextInput
          style={StyleSheet.input}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          placeholder="password"
          autoCapitalize="none"
          secureTextEntry
        />

        <Text>Description: </Text>
        <TextInput
          style={StyleSheet.input}
          onChangeText={(text) => setDescription(text)}
          value={description}
          placeholder="passwdescriptionord"
          autoCapitalize="none"
        />

        <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
        <TouchableOpacity style={styles.btn} onPress={submit}>
          <Text>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  input: {
    borderBottomColor: "#ffbac0",
    borderBottomWidth: 2,
    height: 40,
    width: 300,
    marginTop: 40,
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
