import React from "react";
import { View, Text } from "react-native";
import Register from "../Screen/Login/Register";
import Welcome from "../Screen/Login/Welcome";
import ForgetPassword from "../Screen/Login/ForgetPassword";

import Login from "../Screen/Login/Login";
import MyTabs from "../Navigation/TabNavigation";
import ProfilePic from "../Screen/Profile/ProfilePic";

import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Search" component={MyTabs} />
      <Stack.Screen name="ProfilePic" component={ProfilePic} />
      {/* <Stack.Screen name="Screen1" component={MyTabs} /> */}
    </Stack.Navigator>
  );
}
