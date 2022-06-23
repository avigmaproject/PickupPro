import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  BackHandler,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from "react-native";
// import HeaderArrow from "../../SmartComponent/Header/HeaderArrow";
import Header from "../../SmartComponent/Header/Header";

import { ScrollView } from "react-native-gesture-handler";
import CustomButton2 from "../../SmartComponent/CustomeButton2";
import {
  getcaptaindata,
  postleftteamdata,
  selectedplayer,
  updatelatlong,
} from "../../utils/ConfigApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import * as geolib from "geolib";
import Geolocation from "react-native-geolocation-service";
import { Toast } from "native-base";
export default class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      captainname: [],
      listPlayer: [],
      UserData: [],
      activeIndex: 0,
      width: 0,
      color: "blue",
      index: 0,
      token: null,
      currentLatitude: null,
      currentLongitude: null,

      // data: [
      //   { img: "https://reactnative.dev/img/tiny_logo.png", id: 1 },
      //   { img: "https://reactnative.dev/img/tiny_logo.png", id: 2 },
      //   { img: "https://reactnative.dev/img/tiny_logo.png", id: 3 },
      //   { img: "https://reactnative.dev/img/tiny_logo.png", id: 4 },
      // ],
    };
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentDidMount = async () => {
    this.getLocation();
    console.log("this.props.route.params.gameId", this.props.route.params);
    this.setState({
      gameid: this.props.route.params.gameId,
      captainname: this.props.route.params.captainname,
    });
    this.getAccessToken();
    // this.getCaptainData();
    // await this.getLatLong();
  };

  // componentWillMount() {
  //   BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     this.handleBackButtonClick
  //   );
  // }

  // componentWillUnmount() {
  //   BackHandler.removeEventListener(
  //     "hardwareBackPress",
  //     this.handleBackButtonClick
  //   );
  // }

  // handleBackButtonClick() {
  //   this.props.navigation.goBack(null);
  //   return true;
  // }
  // getLatLong = async () => {
  //   const value = await AsyncStorage.multiGet(["latitude", "longitude"]);
  //   const currentLatitude = JSON.parse(value[0][1]);
  //   const currentLongitude = JSON.parse(value[1][1]);
  //   this.setState(
  //     {
  //       currentLatitude: currentLatitude,
  //       currentLongitude: currentLongitude,
  //     }
  //     // () => this.getSelectedTeam(),
  //   );
  // };
  getAccessToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem("token");
      console.log("tokenteam", token);
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
  };

  getCaptainData = async () => {
    this.setState({ isLoading: true });
    let data = {
      Pagnumber: 1,
      NoOfRows: 100,
      Type: 3,
      User_latitude: 19.039, // this.state.currentLatitude,
      User_longitude: 72.8619, // this.state.currentLongitude,
    };
    console.log("data team", data);
    await getcaptaindata(data, this.state.token)
      .then((res) => {
        console.log("res:teamdata ", res[0]);
        this.setState({
          UserData: res[0],
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
  updateLatLong = async () => {
    const { token, currentLatitude, currentLongitude } = this.state;
    console.log("updateLatLong", token, currentLatitude, currentLongitude);
    // console.log("base64base64base64base64", base64);
    let data = {
      Type: 7,
      User_latitude: currentLatitude,
      User_longitude: currentLongitude,
    };
    console.log("updateLatLongData", data);
    // debugger;

    await updatelatlong(data, token)
      .then((res) => {
        console.log("res:updatelatlong", res);
        this.setState({
          isLoading: false,
        });
        this.getSelectedTeam();
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
  getSelectedTeam = async () => {
    console.log("imherqnanoanf 123");
    this.setState({ isLoading: true });
    let data = {
      Pagnumber: 1,
      NoOfRows: 1000,
      Type: 3,
      User_latitude: this.state.currentLatitude,
      User_longitude: this.state.currentLongitude,
      Game_PkeyID: this.state.gameid,
    };
    console.log("selected team", data, this.state.token);
    await selectedplayer(data, this.state.token)
      .then((res) => {
        console.log("res:selectedteamdata ", res[0]);

        // this.setState({
        //   UserData: player,
        // });
        let selectplayer = [];
        let player = [];
        res[0].map((i) => {
          if (i.Team_PL_Id != 2) {
            player.push(i);
          }
          if (i.User_IsSelected && i.Team_PL_Id === 1) {
            selectplayer.push(i.User_PkeyID);
          }
        });
        this.setState({
          UserData: player,
          isLoading: false,
          listPlayer: selectplayer,
        });
        console.log("playerrrr", player);
        // let pushdata = [];
        // let data = [];
        // for (let i = 0; i < player.length; i++) {
        //   console.log("res: loop", player[i]);
        //   console.log(
        //     parseFloat(player[i].User_latitude),
        //     parseFloat(player[i].User_longitude),
        //     this.state.currentLatitude,
        //     this.state.currentLatitude
        //   );
        //   if (
        //     geolib.isPointWithinRadius(
        //       {
        //         latitude: parseFloat(player[i].User_latitude),
        //         longitude: parseFloat(player[i].User_longitude),
        //       },
        //       {
        //         latitude: this.state.currentLatitude,
        //         longitude: this.state.currentLongitude,
        //       },
        //       1000
        //     )
        //   ) {
        //     console.log("pass", i);
        //     data.push(player[i]);
        //     console.log("data1234", data);
        //   } else {
        //     console.log("fail");
        //   }
        // }
        // console.log("pushdata123", data);
        // this.setState({
        //   UserData: data,
        //   isLoading: false,
        // });

        // console.log("selectplayer", selectplayer);
        // this.setState({
        //   listPlayer: selectplayer,
        //   isLoading: false,
        // });
      })
      .catch((error) => {
        console.log(error);
        console.log(error.request);
        if (error.response) {
          console.log(error.response);
          this.setState({ isLoading: false });
        }
        if (error.request) {
          console.log(error.request);
          this.setState({ isLoading: false });
        }
        console.log("im in catch");
        this.setState({ isLoading: false });
      });
  };
  select = async (id) => {
    console.log(id);
    const exist = this.state.listPlayer.includes(id);
    if (exist) {
      // remove
      this.setState(
        {
          listPlayer: this.state.listPlayer.filter((item) => item != id),
        },
        () => {
          console.log("listpush", this.state.listPlayer);
        }
      );
    } else {
      // add
      if (this.state.listPlayer.length < 5) {
        this.setState(
          {
            listPlayer: [...this.state.listPlayer, id],
          },
          () => {
            console.log("listpull", this.state.listPlayer);
          }
        );
      } else {
        alert("Only Five can player selected ");
      }
    }
  };
  createPlayerJSON = async () => {
    if (this.state.listPlayer.length !== 0) {
      let output = [];
      // let input = ["John", "Hari", "James"];
      let tmp;

      for (let i = 0; (await i) < this.state.listPlayer.length; i++) {
        tmp = {
          PT_UserId: this.state.listPlayer[i],
          PT_GT_PkeyID: this.state.gameid,
          PT_Team_PL_Id: 1,
          Type: 1,
        };
        output.push(tmp);
      }
      console.log("jsonnnnn", output);
      let PlayerDataList = JSON.stringify(output);
      console.log("PlayerDataList", PlayerDataList);
      this.setState({ isLoading: true });
      let data = {
        Type: 1,
        PT_GT_PkeyID: this.state.gameid,
        PT_Team_PL_Id: 1, //Left 1,right 2
        PlayerDataList: PlayerDataList,
      };
      console.log("dataleftteam", data);
      await postleftteamdata(data, this.state.token)
        .then((res) => {
          console.log("res:captaindata ", res);
          this.setState({
            // UserData: res[0],
            isLoading: false,
          });
          this.props.navigation.navigate("TeamRight", {
            gameId: this.state.gameid,
            captainname: this.state.captainname,
          });
        })
        .catch((error) => {
          console.log(error);
          if (error.request) {
            console.log(error.request);
            this.setState({ isLoading: false });
          }
          if (error.response) {
            console.log(error.response);
            this.setState({ isLoading: false });
          }
          console.log("im in catch");
          this.setState({ isLoading: false });
        });
      this.setState({ isLoading: false });
    } else {
      alert("You can select maximum 5 player in a team");
    }
  };
  render() {
    const { isLoading, listPlayer } = this.state;
    console.log("listPlayer123", listPlayer);
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <SafeAreaView>
          <Spinner visible={isLoading} />
          {/* <HeaderArrow */}
          <Header
            title="Thank you for keeping score."
            // navigation={this.props.navigation}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: "center", marginTop: 15 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  color: "#2f363c",
                  fontFamily: "muro",
                  // fontFamily: "Roboto-Light",
                }}
              >
                Please assign players to their respective teams.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#4850CF",
                  fontFamily: "muro",
                  // fontFamily: "Roboto-Medium",
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Selelct players with
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  color: "#4850CF",
                  fontWeight: "bold",
                  fontSize: 15,
                  fontFamily: "muro",
                  // fontFamily: "Roboto-Medium",
                  textTransform: "uppercase",
                }}
              >
                {" "}
                {this.state.captainname[0]}
              </Text>
            </View>
            <View style={{ marginHorizontal: 10, flex: 1, marginBottom: 50 }}>
              <FlatList
                numColumns={2}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={this.state.UserData}
                renderItem={({ item, index }) => {
                  const playerIndex = this.state.listPlayer.findIndex(
                    (playerId) => playerId == item.User_PkeyID
                  );
                  // this.renderItem(item,index)
                  return (
                    <View
                      style={{
                        marginTop: 10,
                        // backgroundColor: "pink",
                        // width: '45%',

                        width: "50%",
                        borderRadius: 75,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingBottom: 20,
                        height: 200,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => this.select(item.User_PkeyID)}
                      >
                        <View>
                          {playerIndex > -1 ? (
                            <View
                              style={{
                                width: 30,
                                height: 30,
                                position: "absolute",
                                justifyContent: "center",
                                alignItems: "center",
                                right: 10,
                                top: 40,
                                borderRadius: 15,
                                zIndex: 10,
                                backgroundColor:
                                  playerIndex < -1
                                    ? "white"
                                    : playerIndex % 2 === 0
                                    ? "#4850CF"
                                    : "#CA5328",
                              }}
                            >
                              <Text
                                style={{
                                  color: "white",
                                  fontFamily: "muro",
                                  fontSize: 20,
                                }}
                              >
                                {playerIndex + 1}
                              </Text>
                            </View>
                          ) : null}
                          <Image
                            style={{
                              height: 140,
                              width: 150,
                              borderRadius: 75,
                              // marginRight: 20,
                              // marginLeft: 20,
                              // backgroundColor: "red",
                              marginTop: 40,
                              borderWidth: playerIndex > -1 ? 5 : 0,
                              borderColor:
                                playerIndex < -1
                                  ? "white"
                                  : playerIndex % 2 === 0
                                  ? "#4850CF"
                                  : "#CA5328",
                            }}
                            source={{
                              uri: item.User_Image_Path
                                ? item.User_Image_Path
                                : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/1200px-Unknown_person.jpg",
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                      <View style={{}}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontFamily: "muro",
                            fontWeight: "bold",
                            color: "#4850CF",
                            textTransform: "capitalize",
                            lineHeight: 40,
                          }}
                        >
                          {item.User_Name}
                        </Text>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(item) => item.User_PkeyID}
              />
              <View
                style={{
                  alignItems: "center",
                  // height: 200,
                  marginTop: 20,
                  marginBottom: 50,
                  // backgroundColor: "red",
                }}
              >
                <CustomButton2
                  title={"NEXT"}
                  onPress={() => this.createPlayerJSON()}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
