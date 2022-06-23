import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Screen1 from "../Screen/Search/Screen1";
import Search from "../Screen/Search/Search";
import Player from "../Screen/Search/Player";
import SearchPlayer from "../Screen/Search/SearchPlayer";
import PonitChartLive from "../Screen/Game/PonitChartLive";
import FinalState1 from "../Screen/Game/FinalState1";
import SearchCourt from "../Screen/Search/SearchCourt";
import PlayerProfile from "../Screen/Search/PlayerProfile";

const SearchStackNavigator = createStackNavigator();
export default function SearchStack({ navigation }) {
  return (
    <SearchStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <SearchStackNavigator.Screen name="Search" component={Search} />
      <SearchStackNavigator.Screen name="Screen1" component={Screen1} />
      <SearchStackNavigator.Screen
        name="SearchPlayer"
        component={SearchPlayer}
      />
      <SearchStackNavigator.Screen name="SearchCourt" component={SearchCourt} />
      <SearchStackNavigator.Screen name="Player" component={Player} />
      <SearchStackNavigator.Screen
        name="PlayerProfile"
        component={PlayerProfile}
      />
      <SearchStackNavigator.Screen
        name="PonitChartLive"
        component={PonitChartLive}
      />
      <SearchStackNavigator.Screen name="FinalState1" component={FinalState1} />
    </SearchStackNavigator.Navigator>
  );
}
