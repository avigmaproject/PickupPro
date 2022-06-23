import React, { Component } from "react";
import { Text, View } from "react-native";

export default class Logout extends Component {
  render() {
    return <View></View>;
  }
}
// export const logOut = async () => {
//     const { navigation } = this.props;

//     let token;
//     try {
//       token = await AsyncStorage.getItem("token");
//       if (token) {
//         console.log("logoutogout", token);
//         await AsyncStorage.removeItem("token");
//         navigation.reset({
//           index: 0,
//           routes: [{ name: "Welcome" }],
//         });
//       } else {
//         console.log("no token found");
//       }
//     } catch (e) {
//       console.log(e);
//     }
//     // console.log("userTokannnnnn", token);
//   };
