import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Welcome extends Component {
  componentDidMount() {
    this.getAccessToken();
  }
  getAccessToken = async () => {
    const { navigation } = this.props;
    let token;
    try {
      token = await AsyncStorage.getItem("token");
      // console.log("tokenlogin", token);
      if (token !== null && token !== undefined && token !== "") {
        // await AsyncStorage.removeItem("token");
        this.setState({
          token,
        });
        // this.props.navigation.dispatch(
        //   NavigationActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({ routeName: "Search" })],
        //   })
        // );
        navigation.reset({
          index: 0,
          routes: [{ name: "Search" }],
        });
        // console.log("tokenlogin", token);
      } else {
        console.log("no token found");
      }
    } catch (e) {
      console.log(e);
    }
    // console.log("logintoken", token);
  };
  render() {
    return (
      <View>
        <ImageBackground
          style={{ height: "100%", width: "100%" }}
          resizeMode="cover"
          source={require("../../assets/icons_folder/background.jpg")}
        >
          <ScrollView>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 120,
              }}
            >
              <Image
                resizeMode="stretch"
                style={{ width: "45%", height: 200, marginBottom: 20 }}
                source={require("../../assets/Logo1.png")}
              />
              {/* <View style={{ flexDirection: "row", marginTop: 20 }}>
										<Text style={{ fontSize: 90,marginRight:5,fontFamily:"KanedaGothic-BoldItalic" }}>PICK-UP</Text>
										<Text style={{ color: "#CA5328", fontSize: 90 ,fontFamily:"KanedaGothic-BoldItalic"}}>PRO</Text>
									</View> */}
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Login")}
                style={{
                  backgroundColor: "#4850CF",
                  height: 50,
                  width: "70%",
                  borderRadius: 10,
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  LOG IN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Register")}
                style={{
                  activeOpacity: 1,
                  height: 50,
                  width: "70%",
                  borderRadius: 10,
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  borderColor: "#4850CF",
                  borderWidth: 1,
                  marginBottom: 100,
                  backgroundColor: "rgba(128,128,128,0.3)",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    marginRight: "3%",
                    fontWeight: "bold",
                  }}
                >
                  NEW USER ?
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View
            style={{ width: "100%", height: 10, backgroundColor: "#CA5328" }}
          ></View>
        </ImageBackground>
      </View>
    );
  }
}
