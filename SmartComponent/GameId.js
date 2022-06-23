import React from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getGameId = async () => {
  let gameid;
  try {
    gameid = await AsyncStorage.getItem("gameid");
    if (gameid !== null && gameid !== undefined && gameid !== "") {
      return gameid;
      // this.setState({
      //   gameid,
      // });
    } else {
      console.log("no gameid found");
    }
  } catch (e) {
    console.log(e);
  }
};
