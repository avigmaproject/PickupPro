import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import HeaderArrow from "../../SmartComponent/Header/HeaderArrow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { serachcourtdata } from "../../utils/ConfigApi";

export default class Screen1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      token: null,
      currentLatitude: null,
      currentLongitude: null,
      serach: null,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.getLatLong();
    this.getAccessToken();
    console.log(this.props.route.params.item);
    this.setState({
      userData: this.props.route.params.item,
    });
  }
  getLatLong = async () => {
    const value = await AsyncStorage.multiGet(["latitude", "longitude"]);
    const currentLatitude = JSON.parse(value[0][1]);
    const currentLongitude = JSON.parse(value[1][1]);
    if (value !== null && value !== undefined && value !== "") {
      this.setState({
        currentLatitude: currentLatitude,
        currentLongitude: currentLongitude,
      });
    }
  };
  getAccessToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem("token");
      console.log("tokencaptain", token);
      if (token !== null && token !== undefined && token !== "") {
        this.setState({
          token,
        });
      } else {
        console.log("no token found");
      }
    } catch (e) {
      console.log(e);
    }
    console.log("logintoken", token);
  };
  getCourtData = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 3,
      Court_Latitude: this.state.currentLatitude,
      Court_Longitude: this.state.currentLongitude,
      Pagnumber: 1,
      NoOfRows: 11,
      Court_Name: this.state.serach,
    };
    console.log("get court data", data);
    await serachcourtdata(data, this.state.token)
      .then((res) => {
        console.log("res: ", res);
        this.setState({
          userData: res[0][0],
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        console.log(error.request);
        let message = "";
        if (error.response) {
          console.log(error.response);
          this.setState({ isLoading: false });
        } else {
          message = "";
        }
        console.log("im in catch");
        this.setState({ isLoading: false });
      });
  };
  render() {
    const { userData, isLoading } = this.state;

    return (
      <SafeAreaView>
        <View style={{ backgroundColor: "white", height: "100%" }}>
          <HeaderArrow title="Courts" navigation={this.props.navigation} />
          <ScrollView>
            <View style={{ marginHorizontal: "4%" }}>
              {/* <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View
                  style={{
                    width: "85%",
                    marginTop: 20,
                    height: 50,
                    borderWidth: 1,
                    borderColor: "lightgray",
                    borderRadius: 10,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    placeholder="Search"
                    value={this.state.serach}
                    style={{ marginLeft: 20, width: "85%" }}
                    onEndEditing={() => this.getCourtData()}
                    onChangeText={(serach) => {
                      this.setState({ serach });
                    }}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        serach: "",
                      })
                    }
                  >
                    <Entypo
                      name="cross"
                      size={25}
                      style={{ marginRight: 20 }}
                      color="lightgray"
                    />
                  </TouchableOpacity>
                </View>
              </View> */}
              <View style={{ marginTop: 30 }}>
                <Text
                  style={{ marginBottom: 10, marginLeft: 40, color: "gray" }}
                >
                  Results
                </Text>
                <TouchableOpacity
                  style={{
                    // backgroundColor: "pink",
                    height: 100,
                    width: 100,
                    top: 30,
                    position: "absolute",
                    zIndex: 10000,
                  }}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <AntDesign
                    onPress={() => this.props.navigation.goBack()}
                    name="left"
                    size={40}
                    style={{
                      position: "absolute",
                      left: 40,
                      fontWeight: "bold",
                      // backgroundColor: "red",
                    }}
                    color="#CA5328"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 20,
                  }}
                >
                  <Image
                    style={{ height: 200, width: 200, borderRadius: 100 }}
                    source={{
                      uri: userData.Court_ImagePath
                        ? userData.Court_ImagePath
                        : "https://www.phoca.cz/images/projects/phoca-gallery-r.png",
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 30,
                  marginBottom: 90,
                }}
              >
                <Text
                  style={{
                    fontSize: 40,
                    fontFamily: "KanedaGothic-BoldItalic",
                  }}
                >
                  {userData.Court_Name}
                </Text>
                <Text
                  style={{
                    fontSize: 30,
                    color: "gray",
                    fontFamily: "KanedaGothic-BoldItalic",
                  }}
                >
                  Outdoor
                </Text>
                <TouchableOpacity
                  onPress={() => null}
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
                  <Text style={{ color: "white", fontSize: 20 }}>
                    VIEW DETAILS
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
