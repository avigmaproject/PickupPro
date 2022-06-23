import React from "react";
import { View, Text, Image, Alert } from "react-native";
import Search from "../Screen/Search/Search";
import Profile from "../Screen/Profile/Profile";
import GmaeStack from "../Navigation/GameStackNavigation";
import SearchStack from "../Navigation/SearchStack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Logout from "../Screen/Login/Logout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundGeolocation from "react-native-background-geolocation";
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

export default function MyTabs({ navigation }) {
  const user = useSelector((state) => state.tabReducer.status);
  const user1 = useSelector((state) => state.tabReducer.status1);

  // alert(user);
  const handleLogout = async () => {
    let token, gameid, value;
    try {
      value = await AsyncStorage.multiGet(["latitude", "longitude"]);
      if (value) {
        const keys = ["latitude", "longitude"];
        await AsyncStorage.multiRemove(keys);
        console.log("remove lat log");
      } else {
        console.log("no latitude  longitude found");
      }
    } catch (e) {
      console.log(e);
    }

    try {
      token = await AsyncStorage.getItem("token");
      gameid = await AsyncStorage.getItem("gameid");
      console.log(token, gameid);
      const token2 = JSON.stringify(token);
      const gameid2 = JSON.stringify(gameid);
      if (gameid2) {
        await AsyncStorage.removeItem("gameid");
        console.log("remove gameid");
      } else {
        console.log("no gameid found");
      }
      if (token2) {
        await AsyncStorage.removeItem("token");
        BackgroundGeolocation.stop();
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      } else {
        console.log("no token found");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener("tabPress", (e) => {
  //     // Prevent default behavior
  //     console.log("tabPresstabPress", e);
  //     // Do something manually
  //     // ...
  //   });

  //   return unsubscribe;
  // });

  return (
    <Tab.Navigator
      //initialRouteName={initialRouteName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let image;
          if (route.name === "SEARCH") {
            image = focused
              ? require("../assets/icon/search-blue.png")
              : require("../assets/icon/search-gray.png");
          } else if (route.name === "CHALLANGES") {
            image = focused
              ? require("../assets/icon/award-gray.png")
              : require("../assets/icon/award-blue.png");
          } else if (route.name === "GAME") {
            image = focused
              ? require("../assets/icon/games-blue.png")
              : require("../assets/icon/games-gray.png");
          } else if (route.name === "INBOX") {
            image = focused
              ? require("../assets/icon/message-blue.png")
              : require("../assets/icon/message-gray.png");
          } else if (route.name === "PROFILE") {
            image = focused
              ? require("../assets/icon/user-blue.png")
              : require("../assets/icon/user-gray.png");
          } else if (route.name === "LOGOUT") {
            image = focused
              ? require("../assets/icon/logout-blue.png")
              : require("../assets/icon/logout-gray.png");
          }
          return (
            <Image
              source={image}
              style={{ height: 45, width: 45, resizeMode: "stretch" }}
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: "black",
        inactiveTintColor: "gray",
        keyboardHidesTabBar: true,
        labelStyle: {
          fontWeight: "bold",
        },
        style: {
          backgroundColor: "#DCDCDC",
          height: Platform.OS === "ios" ? 100 : 70,
        },
      }}
    >
      <Tab.Screen
        name="SEARCH"
        component={SearchStack}
        listeners={({ navigation, route }) => ({
          tabPress: async (e) => {
            if (user1) {
              e.preventDefault();

              // return null;
            }
          },
        })}
      />
      <Tab.Screen
        name="GAME"
        component={GmaeStack}
        listeners={({ navigation, route }) => ({
          tabPress: async (e) => {
            if (user) {
              e.preventDefault();

              // return null;
            }
          },
        })}
      />
      <Tab.Screen
        name="PROFILE"
        component={Profile}
        listeners={({ navigation, route }) => ({
          tabPress: async (e) => {
            if (user1) {
              e.preventDefault();

              // return null;
            }
          },
        })}
      />
      <Tab.Screen
        name="LOGOUT"
        component={Logout}
        listeners={({ navigation, route }) => ({
          tabPress: async (e) => {
            if (user1) {
              e.preventDefault();
            } else {
              e.preventDefault();
              Alert.alert("LOGOUT", "Do you want to Logout?", [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "OK", onPress: () => handleLogout() },
              ]);
            }
          },
        })}
      />

      {/* <Tab.Screen name="INBOX" component={Chat} /> */}
      {/* <Tab.Screen name="CHALLANGES" component={Challange} /> */}
    </Tab.Navigator>
  );
}
