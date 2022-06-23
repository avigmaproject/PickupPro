import React from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MyTabs from "../Navigation/TabNavigation";
import ProfilePic from "../Screen/Profile/ProfilePic";

import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

export default function MyStack2() {
  const mode = useSelector((state) => state.authReducer.registerMode);
  console.log("modemodemodemodestack", mode);

  return (
    <Stack.Navigator
      // initialRouteName={mode ? "ProfilePic" : "Search"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Search" component={MyTabs} />
      <Stack.Screen name="ProfilePic" component={ProfilePic} />
    </Stack.Navigator>
  );
}
