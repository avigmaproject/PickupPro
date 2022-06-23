import React from "react";
import { View, Text } from "react-native";
import NewGame from "../Screen/Game/NewGame";
import SelectCaptain from "../Screen/Game/SelectCaptain";
import Team from "../Screen/Game/Team";
import Option from "../Screen/Game/Option";
import LiveGame from "../Screen/Game/LiveGame";
import FinalStats from "../Screen/Game/FinalStats";
import PointChart from "../Screen/Game/PointChart";
import Game1 from "../Screen/Game/Game1";
import TeamRight from "../Screen/Game/TeamRight";

import { createStackNavigator } from "@react-navigation/stack";

const GameStack = createStackNavigator();

export default function GmaeStack() {
  return (
    <GameStack.Navigator screenOptions={{ headerShown: false }}>
      <GameStack.Screen name="Game1" component={Game1} />
      <GameStack.Screen name="Game" component={NewGame} />
      <GameStack.Screen name="SelectCaptain" component={SelectCaptain} />
      <GameStack.Screen name="Team" component={Team} />
      <GameStack.Screen name="Option" component={Option} />
      <GameStack.Screen name="LiveGame" component={LiveGame} />
      <GameStack.Screen name="FinalStats" component={FinalStats} />
      <GameStack.Screen name="PointChart" component={PointChart} />
      <GameStack.Screen name="TeamRight" component={TeamRight} />
    </GameStack.Navigator>
  );
}
