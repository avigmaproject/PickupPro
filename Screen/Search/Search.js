import React, { Component } from "react";
import {
  Text,
  View,
  Platform,
  Image,
  FlatList,
  TouchableOpacity,
  BackHandler,
  Alert,
  SafeAreaView,
  Dimensions,
  PermissionsAndroid,
  ScrollView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Header from "../../SmartComponent/Header/Header";
import Entypo from "react-native-vector-icons/Entypo";
const { height } = Dimensions.get("window");
const uiMargin = height / 10;
import Geolocation from "react-native-geolocation-service";
import { updatelatlong, gethomedetail } from "../../utils/ConfigApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "native-base";
const modalMargin = height / 3.5;
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { showTabBar, showTabBar1 } from "../../store/action/tabbar/action";
import Spinner from "react-native-loading-spinner-overlay";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      state: false,
      currentLatitude: null,
      currentLongitude: null,
      latitude: null,
      longitude: null,
      filterModal: false,
      forceLocation: true,
      showLocationDialog: true,
      highAccuracy: false,
      gameid: null,
      court: [],
      isLoading: false,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  handleBackButtonClick() {
    Alert.alert("Hold on!", "Are you sure you want to Exit App?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  }

  componentWillUnmount() {
    this._unsubscribe;
    this.backhandler;
  }
  componentDidMount = async () => {
    this.backhandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    this.unsubscribe = this.props.navigation.addListener("focus", async () => {
      await this.getAccessToken();
      this.props.showTabBar1(false);

      this.getHomeDetail();
      // this.gamescore = setInterval(this.getHomeDetail, 100000);

      //     console.log("mounteddd");
    });
  };
  getAccessToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem("token");
      console.log("tokencaptain", token);
      if (token !== null && token !== undefined && token !== "") {
        this.setState(
          {
            token,
          },
          () => this.getLocation()
        );
      } else {
        console.log("no token found");
      }
    } catch (e) {
      console.log(e);
    }
    console.log("logintoken", token);
  };
  updateLatLong = async () => {
    const { token, currentLatitude, currentLongitude } = this.state;
    // alert(currentLatitude);
    // alert(currentLongitude);
    console.log("updateLatLong", token, currentLatitude, currentLongitude);
    let data = {
      Type: 7,
      User_latitude: currentLatitude,
      User_longitude: currentLongitude,
    };
    console.log("updateLatLongData", data);
    // debugger;

    await updatelatlong(data, token)
      .then((res) => {
        console.log("res:updatelatlong", res[0]);
        this.setState({
          isLoading: false,
          // filterModal
        });
      })
      .catch((error) => {
        if (error.request) {
          console.log(error.request);
        } else if (error.responce) {
          console.log(error.responce);
        } else {
          console.log(error);
        }
      });
  };
  getHomeDetail = async () => {
    this.setState({
      isLoading: true,
    });
    // alert("hiii");
    let data = {
      Type: 1,
    };
    console.log("getHomeDetailminal", data, this.state.token);
    await gethomedetail(data, this.state.token)
      .then((res) => {
        console.log("res:getHomeDetailminla", res[1][0]);

        // console.log("res:getHomeDetail22", !res[0][0].Game_IsPlaying);
        this.setState({
          isLoading: false,
          court: res[1],
          filterModal: !res[0][0].Game_IsPlaying,
          gameid: res[0][0].Game_PkeyID,
        });
        this.props.showTabBar(!res[0][0].Game_IsPlaying);
        if (!res[0][0].Game_IsPlaying) {
          AsyncStorage.setItem("gameid", res[0][0].Game_PkeyID.toString());
        }

        // if (res[0][0].Game_IsPlaying) {
        //   // alert("disable");
        //   this.props.navigation.setOptions({ tabBarVisible: false });
        //   console.log("naivgationnnnnn", this.props.navigation.setOptions);
        // }
      })
      .catch((error) => {
        if (error.request) {
          this.setState({
            isLoading: false,
          });
          console.log(error.request);
        } else if (error.responce) {
          this.setState({
            isLoading: false,
          });
          console.log(error.responce);
        } else {
          this.setState({
            isLoading: false,
          });
          console.log(error);
        }
      });
  };

  componentWillUnmount() {
    clearInterval(this.gamescore);
  }
  // componentDidUpdate(prevProps) {
  //   if (prevProps.isFocused !== this.props.isFocused)
  //     this.props.isFocused === true
  //       ? (this.backhandler = BackHandler.addEventListener(
  //           "hardwareBackPress",
  //           this.handleBackButtonClick
  //         ))
  //       : this.backHandler.remove();
  // }

  hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert("Unable to open settings");
      });
    };
    const status = await Geolocation.requestAuthorization("whenInUse");
    console.log("Check");
    if (status === "granted") {
      console.log("granted");
      return true;
    }

    if (status === "denied") {
      Alert.alert(
        `Turn on Location Services to allow pickuppro to determine your location.`,
        "",
        [
          {
            text: "Don't Use Location",
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]
      );

      console.log("denied");
    }

    if (status === "disabled") {
      Alert.alert(
        `Turn on Location Services to allow pickuppro to determine your location.`,
        "",
        [
          { text: "Go to Settings", onPress: openSetting },
          {
            text: "Don't Use Location",
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]
      );

      console.log("disable");
    }

    return false;
  };

  hasLocationPermission = async () => {
    if (Platform.OS === "ios") {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === "android" && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        "Location permission denied by user.",
        ToastAndroid.LONG
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        "Location permission revoked by user.",
        ToastAndroid.LONG
      );
    }

    return false;
  };
  showMessage = (message) => {
    if (message !== "" && message !== null && message !== undefined) {
      Toast.show({
        text: message,
        duration: 5000,
      });
    }
  };
  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      console.log("POst");
      return;
    }

    this.setState({ isLoading: true }, () => {
      // Geolocation.requestAuthorization("always");
      Geolocation.getCurrentPosition(
        (position) => {
          // console.log("positionposition", position);
          this.setState(
            {
              currentLatitude: position.coords.latitude,
              currentLongitude: position.coords.longitude,
              isLoading: false,
            },
            () => this.saveLocation()
          );
        },
        (error) => {
          this.setState({ isLoading: false });
          console.log("loction time out", error);
          this.showMessage("Unable to find location");
        },
        {
          accuracy: {
            android: "high",
            ios: "best",
          },
          enableHighAccuracy: this.state.highAccuracy,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
          forceRequestLocation: this.state.forceLocation,
          showLocationDialog: this.state.showLocationDialog,
        }
      );
    });
  };
  saveLocation = async () => {
    const { currentLatitude, currentLongitude } = this.state;
    try {
      // const longitude = ["longitude", JSON.stringify(72.8619)];
      // const latitude = ["latitude", JSON.stringify(19.039)];
      const latitude = ["latitude", JSON.stringify(currentLatitude)];
      const longitude = ["longitude", JSON.stringify(currentLongitude)];
      await AsyncStorage.multiSet([latitude, longitude]);
      console.log("Set: ", latitude, longitude);
      // this.updateLatLong();
      //
    } catch (error) {
      console.log(" Location error ", error);
    }
  };

  render() {
    console.log("hiiiii", this.state.court);
    return (
      <SafeAreaView style={{ height: "100%" }}>
        <Header title="Search players & courts" />
        <Spinner visible={this.state.isLoading} />
        <ScrollView>
          <View
            style={{
              marginHorizontal: "8%",
              marginTop: 20,
              marginBottom: 100,
              // backgroundColor: "pink",
            }}
          >
            {this.state.court.length > 0 && (
              <View>
                <Text
                  style={{
                    fontFamily: "muro",
                    fontWeight: "bold",
                    marginTop: 10,
                    marginBottom: 20,
                    color: "#4850CF",
                  }}
                >
                  Last court where you played.
                </Text>
              </View>
            )}
            <View>
              <FlatList
                horizontal={true}
                //  showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={this.state.court}
                renderItem={({ item, index }) => {
                  return (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        // backgroundColor: "pink",
                        width: 150,
                      }}
                    >
                      <Image
                        style={{
                          height: 100,
                          width: 100,
                          borderRadius: 50,
                        }}
                        source={{
                          uri: item.Court_ImagePath
                            ? item.Court_ImagePath
                            : "https://www.phoca.cz/images/projects/phoca-gallery-r.png",
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: "muro",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          marginTop: 10,
                        }}
                      >
                        {item.Court_Name}
                      </Text>
                    </View>
                  );
                  // console.log("hiii2389347928347", item);
                }}
                keyExtractor={(item) => item.Court_PkeyID}
              />

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("SearchPlayer")}
                // onPress={() => this.props.navigation.navigate("Player")}
                style={{ flexDirection: "row" }}
              >
                <View
                  style={{
                    backgroundColor: "#f1f1f1",
                    // height: 100,
                    width: "99%",
                    borderTopLeftRadius: 60,
                    borderBottomLeftRadius: 60,
                    marginTop: 20,
                    flexDirection: "row",
                  }}
                >
                  <View>
                    <Image
                      style={{
                        height: 80,
                        width: 80,
                        borderRadius: 40,
                        // elevation: 20,
                      }}
                      source={{
                        uri:
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy09Zp5FS7ZJq7c1gEW4ky5RFk6xA8Cc6kTbM6bxOrsYvQioQg0OW39hpnINeaBp_s0Rc&usqp=CAU",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      // backgroundColor: "pink",
                      justifyContent: "center",
                      marginLeft: 15,
                      width: "30%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        color: "#2f363c",
                        fontFamily: "muro",
                        fontWeight: "bold",
                        fontStyle: "italic",
                      }}
                    >
                      Players
                    </Text>
                  </View>
                  <View
                    style={{
                      // backgroundColor: "orange",
                      justifyContent: "center",
                      marginLeft: 10,
                      width: "15%",
                    }}
                  >
                    {/* <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "KanedaGothic-BoldItalic",
                        color: "gray",
                      }}
                    >
                      SF/PF
                    </Text> */}
                  </View>
                  <View
                    style={{
                      // backgroundColor: "red",
                      justifyContent: "center",
                      marginLeft: "10%",
                      width: "13%",
                    }}
                  >
                    <Feather
                      name="arrow-right-circle"
                      size={25}
                      // style={{ marginRight: 10 }}
                      color="#4850CF"
                    />
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: "#CA5328",
                    // height: 100,
                    width: "1%",
                    marginTop: 20,
                  }}
                ></View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("SearchCourt")}
                style={{ flexDirection: "row" }}
              >
                <View
                  style={{
                    backgroundColor: "#f1f1f1",
                    // height: 100,
                    width: "99%",
                    borderTopLeftRadius: 60,
                    borderBottomLeftRadius: 60,
                    marginTop: 20,
                    flexDirection: "row",
                  }}
                >
                  <View>
                    <Image
                      style={{
                        height: 80,
                        width: 80,
                        borderRadius: 40,
                        // elevation: 20,
                      }}
                      source={{
                        uri:
                          "https://png.pngtree.com/png-vector/20191130/ourmid/pngtree-tennis-court-icon-circle-png-image_2055360.jpg",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      // backgroundColor: "pink",
                      justifyContent: "center",
                      marginLeft: 15,
                      width: "30%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "muro",
                        fontWeight: "bold",
                        fontStyle: "italic",
                      }}
                    >
                      Court
                    </Text>
                  </View>
                  <View
                    style={{
                      // backgroundColor: "orange",
                      justifyContent: "center",
                      marginLeft: 10,
                      width: "15%",
                    }}
                  >
                    {/* <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "KanedaGothic-BoldItalic",
                      color: "gray",
                    }}
                  >
                    SF/PF
                  </Text> */}
                  </View>
                  <View
                    style={{
                      // backgroundColor: "red",
                      justifyContent: "center",
                      marginLeft: "10%",
                      width: "13%",
                    }}
                  >
                    <Feather
                      name="arrow-right-circle"
                      size={25}
                      // style={{ marginRight: 10 }}
                      color="#4850CF"
                    />
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: "#CA5328",
                    // height: 100,
                    width: "1%",
                    marginTop: 20,
                  }}
                ></View>
              </TouchableOpacity>
            </View>
            {this.state.filterModal && (
              <View
                style={{
                  // justifyContent: "center",
                  // alignItems: "center",
                  // paddingHorizontal: 10,
                  // backgroundColor: "red",
                  marginTop: 10,
                  height: 150,
                }}
              >
                <Text style={{ lineHeight: 30 }}>
                  You are aready in game , so you can not access app for now. As
                  game ended you chack again and access the app again
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("PonitChartLive", {
                      gameid: this.state.gameid,
                    })
                  }
                >
                  <Text style={{ lineHeight: 30, color: "#4850CF" }}>
                    Let's check game
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  // token: state.authReducer.token,
  // parentid: state.parentidReducer.parentid,
});

const mapDispatchToProps = {
  showTabBar,
  showTabBar1,
};
export default connect(mapStateToProps, mapDispatchToProps)(Search);
