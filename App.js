import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Icônes
import { Ionicons } from "@expo/vector-icons";

// Composants
import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import SettingsScreen from "./containers/SettingsScreen";
import RoomScreen from "./containers/RoomScreen";
import AroundMeScreen from "./containers/AroundMeScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);

  // MAJ Token User
  const setToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
    } else {
      await AsyncStorage.removeItem("userToken");
    }

    setUserToken(token);
  };

  // MAJ Token ID User
  const setId = async (Id) => {
    if (Id) {
      await AsyncStorage.setItem("userId", Id);
    } else {
      await AsyncStorage.removeItem("userId");
    }

    setUserId(Id);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const checkIfATokenExist = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setUserToken(userToken);
      setUserId(userId);
      setIsLoading(false);
    };

    checkIfATokenExist();
  }, []);

  if (isLoading === true) {
    // We haven't finished checking for the token yet
    return null;
  }
  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator>
  //       <Stack.Screen name="Tab" options={{ headerShown: false }}>
  //         {() => (
  //           <Tab.Navigator
  //             screenOptions={{
  //               headerShown: false,
  //               tabBarActiveTintColor: "tomato",
  //               tabBarInactiveTintColor: "gray",
  //             }}
  //           >
  //             <Tab.Screen
  //               name="TabHome"
  //               options={{
  //                 tabBarLabel: "Home",
  //                 tabBarIcon: ({ color, size }) => (
  //                   <Ionicons name={"ios-home"} size={size} color={color} />
  //                 ),
  //               }}
  //             >
  //               {() => (
  //                 <Stack.Navigator>
  //                   <Stack.Screen
  //                     name="Home"
  //                     options={{
  //                       title: "List",
  //                       headerStyle: { backgroundColor: "red" },
  //                       headerTitleStyle: { color: "white" },
  //                     }}
  //                   >
  //                     {() => <HomeScreen />}
  //                   </Stack.Screen>

  //                   <Stack.Screen
  //                     name="Room"
  //                     options={{
  //                       title: "Room Detail",
  //                       headerStyle: { backgroundColor: "red" },
  //                       headerTitleStyle: { color: "white" },
  //                     }}
  //                   >
  //                     {() => <RoomScreen />}
  //                   </Stack.Screen>

  //                   <Stack.Screen
  //                     name="Profile"
  //                     options={{
  //                       title: "User Profile",
  //                     }}
  //                   >
  //                     {() => <ProfileScreen />}
  //                   </Stack.Screen>
  //                 </Stack.Navigator>
  //               )}
  //             </Tab.Screen>

  //             <Tab.Screen
  //               name="AroundMe"
  //               component={AroundMeScreen}
  //               options={{
  //                 tabBarLabel: "Around me",
  //                 tabBarIcon: ({ color, size }) => (
  //                   <Ionicons
  //                     name={"ios-locate-outline"}
  //                     size={size}
  //                     color={color}
  //                   />
  //                 ),
  //               }}
  //             ></Tab.Screen>

  //             <Tab.Screen
  //               name="TabSettings"
  //               component={SettingsScreen}
  //               options={{
  //                 tabBarLabel: "Settings",
  //                 tabBarIcon: ({ color, size }) => (
  //                   <Ionicons name={"ios-options"} size={size} color={color} />
  //                 ),
  //               }}
  //             ></Tab.Screen>
  //           </Tab.Navigator>
  //         )}
  //       </Stack.Screen>
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen name="SignIn">
              {() => <SignInScreen setToken={setToken} setId={setId} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp">
              {() => <SignUpScreen setToken={setToken} setId={setId} />}
            </Stack.Screen>
          </>
        ) : (
          // User is signed in ! 🎉
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: "tomato",
                  tabBarInactiveTintColor: "gray",
                }}
              >
                <Tab.Screen
                  name="TabHome"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Home"
                        options={{
                          title: "List",
                          headerStyle: { backgroundColor: "red" },
                          headerTitleStyle: { color: "white" },
                        }}
                      >
                        {() => <HomeScreen />}
                      </Stack.Screen>

                      <Stack.Screen
                        name="Room"
                        options={{
                          title: "Room Detail",
                          headerStyle: { backgroundColor: "red" },
                          headerTitleStyle: { color: "white" },
                        }}
                      >
                        {() => <RoomScreen />}
                      </Stack.Screen>

                      <Stack.Screen
                        name="Profile"
                        options={{
                          title: "User Profile",
                        }}
                      >
                        {() => <ProfileScreen />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="AroundMe"
                  component={AroundMeScreen}
                  options={{
                    tabBarLabel: "Around me",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name={"ios-locate-outline"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                ></Tab.Screen>

                <Tab.Screen
                  name="TabProfile"
                  options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name={"ios-options"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Profile"
                        options={{
                          title: "My Profile",
                        }}
                      >
                        {() => (
                          <ProfileScreen
                            token={userToken}
                            setToken={setToken}
                            id={userId}
                            setId={setId}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
