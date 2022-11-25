import { useNavigation } from "@react-navigation/core";
import {
  Button,
  Text,
  TextInput,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useState } from "react";

export default function SignInScreen({ setToken, setId }) {
  const navigation = useNavigation();

  const [email, setEmail] = useState("bb@gmail.com");
  const [password, setPassword] = useState("a");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    // FRONT on vérifie que tous les champs soient renseignés
    if (!email || !password) {
      setError("Remplir tous les champs");
      return;
    }

    try {
      const response = await axios.post(
        "https://express-airbnb-api.herokuapp.com/user/log_in",
        {
          email: email,
          password: password,
        }
      );

      setToken(response.data.token);
      setId(response.data.id);
    } catch (error) {
      console.log(error.response.data);
    }
  };
  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={{ marginTop: 55 }}>Email: </Text>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email"
          autoCapitalize="none"
        />
        <Text>Password: </Text>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          placeholder="password"
          secureTextEntry={true}
          value={password}
          autoCapitalize="none"
        />
        <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
        <TouchableOpacity style={styles.btn} onPress={submit}>
          <Text>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text>No account ? Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    marginVertical: 25,
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
