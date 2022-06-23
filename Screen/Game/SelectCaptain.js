import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from "react-native";
import Header from "../../SmartComponent/Header/Header";
import CustomButton from "../../SmartComponent/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getcaptaindata,
  searchmasterdata,
  postcaptaindata,
  updatelatlong,
} from "../../utils/ConfigApi";
import Spinner from "react-native-loading-spinner-overlay";
import { Toast } from "native-base";
import * as geolib from "geolib";
import Geolocation from "react-native-geolocation-service";
import SearchableDropdown from "react-native-searchable-dropdown";
import Entypo from "react-native-vector-icons/Entypo";

export default class SelectCaptain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listPlayer: [],
      UserData: [],
      activeIndex: 0,
      width: 0,
      color: "blue",
      index: 0,
      token: null,
      currentLongitude: null,
      currentLatitude: null,
      search: "",
      gameid: null,
      CourtData: [],
      CaptainID: null,
      latitude: null,
      longitude: null,
      storePlayerData: [],
      output: [],
      backupData: [],
      // data: [
      //   { img: "https://reactnative.dev/img/tiny_logo.png", id: 1 },
      //   { img: "https://reactnative.dev/img/tiny_logo.png", id: 2 },
      //   { img: "https://reactnative.dev/img/tiny_logo.png", id: 3 },
      //   { img: "https://reactnative.dev/img/tiny_logo.png", id: 4 },
      // ],
    };
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentDidMount = () => {
    const { navigation } = this.props;
    this._unsubscribe = navigation.addListener("focus", () => {
      console.log(
        "this.props.route.params.gameId",
        this.props.route.params.CourtData
      );
      this.setState({
        gameid: this.props.route.params.gameId,
        CourtData: this.props.route.params.CourtData,
      });
    });

    this.getAccessToken();
    // this.getCaptainData();
    this.getLocation();

    this.getLatLong();
  };

  getLatLong = async () => {
    const value = await AsyncStorage.multiGet(["latitude", "longitude"]);
    const currentLatitude = JSON.parse(value[0][1]);
    const currentLongitude = JSON.parse(value[1][1]);
    if (value !== null && value !== undefined && value !== "") {
      this.setState(
        {
          currentLatitude: currentLatitude,
          currentLongitude: currentLongitude,
        },

        () => this.getCaptainData(),
        console.log(
          "asyncstorage",
          this.state.currentLatitude,
          this.state.currentLongitude
        )
      );
    }
  };
  updateLatLong = async () => {
    const { token, currentLatitude, currentLongitude } = this.state;
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
        console.log("res:updatelatlong", res);
        this.setState({
          isLoading: false,
        });
        this.getCaptainData();
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
  getSearchData = async () => {
    if (this.state.search) {
      this.setState({ isLoading: true });
      let data = {
        User_Name: this.state.search,
        Pagnumber: 1,
        NoOfRows: 100,
        Type: 3,
        User_latitude: this.state.currentLatitude, // 19.039, //
        User_longitude: this.state.currentLongitude, // 72.8619, //
      };
      console.log("search data", data);
      await searchmasterdata(data, this.state.token)
        .then((res) => {
          console.log("res:searchmasterdata ", res);
          this.setState({
            UserData: res[0],
            isLoading: false,
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
    } else {
      this.getCaptainData();
    }
  };
  createPlayerJSON = async () => {
    if (this.state.listPlayer.length < 2) {
      alert("Atleast Two captain must required");
    } else {
      let output = [];
      let tmp;

      for (let i = 0; (await i) < this.state.listPlayer.length; i++) {
        if (i === 0) {
          tmp = {
            Team_Captain_ID: this.state.listPlayer[i],
            Team_Game_PkeyID: this.state.gameid,
            Team_PL_Id: i + 1,
            Team_Name: "left",
            Type: 1,
          };
          output.push(tmp);
        } else {
          tmp = {
            Team_Captain_ID: this.state.listPlayer[i],
            Team_Game_PkeyID: this.state.gameid,
            Team_PL_Id: i + 1,
            Team_Name: "right",
            Type: 1,
          };
          output.push(tmp);
        }
      }
      console.log("jsonnnnn", output);
      let TeamData = JSON.stringify(output);
      console.log("TeamDataTeamData", TeamData);
      this.setState({ isLoading: true });
      let data = {
        Type: 1,
        Team_Game_PkeyID: this.state.gameid,
        TeamData: TeamData,
      };
      console.log("post captain data", data);
      await postcaptaindata(data, this.state.token)
        .then((res) => {
          console.log("res:post captain data ", res);
          this.setState({
            // CaptainID: res[0],
            isLoading: false,
          });
          this.props.navigation.navigate("Team", {
            gameId: this.state.gameid,
            captainname: this.state.storePlayerData,
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
    }
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
      // this.getCaptainData();

      // this.updateLatLong();
      //
    } catch (error) {
      console.log(" Location error ", error);
    }
  };
  getCaptainData = async () => {
    this.textInput.clear();
    // this.configureBackgroundLocation();

    this.setState({ isLoading: true });
    let data = {
      Pagnumber: 1,
      NoOfRows: 1000,
      Type: 3,
      User_latitude: this.state.currentLatitude,
      User_longitude: this.state.currentLongitude,
      Game_PkeyID: this.state.gameid,
    };
    console.log("get captain data", data);
    await getcaptaindata(data, this.state.token)
      .then((res) => {
        console.log("res:get captain data ", res);
        console.log("res: ", res[0]);
        this.setState({
          UserData: res[0],
          backupData: res[0],
          isLoading: false,
        });

        // let pushdata = [];
        // let data = [];
        // for (let i = 0; i < res[0].length; i++) {
        //   if (
        //     geolib.isPointWithinRadius(
        //       {
        //         latitude: parseFloat(res[0][i].User_latitude),
        //         longitude: parseFloat(res[0][i].User_longitude),
        //       },
        //       {
        //         latitude: this.state.currentLatitude,
        //         longitude: this.state.currentLongitude,
        //       },
        //       1000
        //     )
        //   ) {
        //     console.log("pass", i);
        //     data.push(res[0][i]);
        //     // console.log("data1234", data);
        //   } else {
        //     console.log("fail");
        //   }
        // }
        // console.log("pushdata123", data);

        // this.setState({
        //   UserData: data,
        //   isLoading: false,
        // });
      })
      .catch((error) => {
        if (error.request) {
          console.log("request :", error.request);
          this.setState({ isLoading: false });
        }
        if (error.response) {
          console.log("response : ", error.response);
          this.setState({ isLoading: false });
        }
        console.log("comman error", error);
        this.showMessage("Server Error");
        console.log("im in catch");
        this.setState({ isLoading: false });
      });
  };
  searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = this.state.UserData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        // return console.log(item.User_Name);
        // console.log(item.User_Name);
        const itemData = item.User_Name
          ? item.User_Name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      // console.log(newData);
      // const dataGroup = this.getContact(newData);
      // this.props.setContacts(dataGroup);
      this.setState({
        UserData: newData,
      });
    } else {
      // const dataGroup = this.getContact(this.state.data);
      // this.props.setContacts(dataGroup);
      this.setState({
        UserData: this.state.backupData,
      });
    }
  };
  select = async (id, item) => {
    const exist = this.state.listPlayer.includes(id);
    const nameexist = this.state.storePlayerData.includes(item.User_Name);
    if (nameexist) {
      this.setState({
        storePlayerData: this.state.storePlayerData.filter(
          (p) => p != item.User_Name
        ),
      });
    } else {
      if (this.state.listPlayer.length < 2) {
        this.setState({
          storePlayerData: [...this.state.storePlayerData, item.User_Name],
        });
      }
    }
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
      if (this.state.listPlayer.length < 2) {
        this.setState(
          {
            selectedData: item,
            listPlayer: [...this.state.listPlayer, id],
          },
          () => {
            console.log("listpull", this.state.listPlayer);
          }
        );
      } else {
        alert("Only two player selected ");
      }
    }
  };
  showMessage = (message) => {
    if (message !== "" && message !== null && message !== undefined) {
      Toast.show({
        text: message,
        duration: 5000,
      });
    }
  };
  render() {
    const { isLoading, CourtData } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView>
          <Spinner visible={isLoading} />
          {/* <HeaderArrow */}
          <Header
            title="Select captains"
            // navigation={this.props.navigation}
          />
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Image
                style={{ height: 70, width: 70, borderRadius: 35 }}
                source={{
                  uri: CourtData.Court_ImagePath
                    ? CourtData.Court_ImagePath
                    : "https://www.phoca.cz/images/projects/phoca-gallery-r.png",
                }}
              />

              <View style={{ width: "40%" }}>
                <Text
                  style={{
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontFamily: "KanedaGothic-BoldItalic",
                    fontSize: 20,
                    color: "#2f363c",
                  }}
                >
                  {this.state.CourtData.Court_Name
                    ? this.state.CourtData.Court_Name
                    : this.state.msg}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{
                  backgroundColor: "#4850CF",
                  padding: 15,
                  // height: 40,
                }}
              >
                <Text
                  style={{ fontSize: 10, fontWeight: "bold", color: "#ffff" }}
                >
                  CHANGE
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center", marginTop: 30 }}>
              {/* {output && (
                <SearchableDropdown
                  onTextChange={(text) => this.setState({ search: text })}
                  // Change listner on the searchable input
                  onItemSelect={(item) => this.getSearchData(item.name)}
                  // Called after the selection from the dropdown
                  containerStyle={{ paddingTop: 25 }}
                  // Suggestion container style
                  textInputStyle={{
                    // Inserted text style
                    padding: 12,
                    width: 300,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    backgroundColor: "white",
                    borderRadius: 5,
                  }}
                  itemStyle={{
                    // Single dropdown item style
                    padding: 10,
                    marginTop: 2,
                    // backgroundColor: "#FAF9F8",
                    // borderColor: "#bbb",
                    // borderWidth: 1,
                  }}
                  itemTextStyle={{
                    // Text style of a single dropdown item
                    color: "#222",
                  }}
                  itemsContainerStyle={{
                    // Items container style you can pass maxHeight
                    // To restrict the items dropdown hieght
                    maxHeight: 250,
                  }}
                  items={output}
                  // Mapping of item array
                  // Default selected item index
                  placeholder="Start typing to search "
                  // Place holder for the search input
                  resetValue={false}
                  // Reset textInput Value with true and false state
                  underlineColorAndroid="transparent"
                  // To remove the underline from the android input
                />
              )} */}
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
                  placeholder="Search players"
                  style={{ marginLeft: 10, width: "85%" }}
                  ref={(input) => {
                    this.textInput = input;
                  }}
                  // onEndEditing={() => this.getSearchData()}
                  onChangeText={(search) => {
                    this.setState({ search });
                    this.searchFilterFunction(search);
                  }}
                />
                {this.state.search ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState(
                        {
                          search: "",
                          UserData: [],
                        },
                        () => this.getCaptainData()
                      )
                    }
                  >
                    <Entypo
                      name="cross"
                      size={25}
                      style={{ marginRight: 20 }}
                      color="lightgray"
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  flex: 1,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  // marginBottom: 50,
                  // backgroundColor: "green",
                }}
              >
                <FlatList
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  data={this.state.UserData}
                  renderItem={({ item }) => {
                    // this.renderItem(item,index)
                    const playerIndex = this.state.listPlayer.findIndex(
                      (playerId) => playerId == item.User_PkeyID
                    );

                    return (
                      <View
                        style={{
                          // width: "50%",
                          paddingHorizontal: 10,
                          // backgroundColor: "red",
                        }}
                      >
                        {/* <Text>{playerIndex}</Text> */}
                        <View
                          style={{
                            marginTop: 50,
                            // backgroundColor: "pink",
                            // width: "50%",
                            height: 150,
                            // width: 200,
                            // borderRadius: 75,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => this.select(item.User_PkeyID, item)}
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
                                    right: 0,
                                    top: 20,
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
                                      fontWeight: "bold",
                                      // fontFamily: "KanedaGothic-BoldItalic",
                                      fontSize: 20,
                                    }}
                                  >
                                    {playerIndex + 1}
                                  </Text>
                                </View>
                              ) : null}

                              <Image
                                style={{
                                  height: 150,
                                  width: 150,
                                  borderRadius: 75,
                                  // marginRight: 20,
                                  // marginLeft: 20,
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
                        </View>
                        <View
                          style={{
                            marginTop: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              // fontSize: 40,
                              // fontFamily: "KanedaGothic-BoldItalic",
                              // color: "#4850CF",
                              fontSize: 20,
                              color: "#4850CF",
                              fontFamily: "muro",
                              fontWeight: "bold",
                              textTransform: "capitalize",
                              // fontStyle: "italic",
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

                <View style={{ width: "100%", marginBottom: 80 }}>
                  <View style={{ alignItems: "center", marginTop: 40 }}>
                    <CustomButton
                      title={"PICK TEAMS"}
                      // onPress={() => this.props.navigation.navigate("Team")}
                      onPress={() => this.createPlayerJSON()}
                    />
                    {/* {this.state.listPlayer.length !== 0 ? (
                    <CustomButton
                      title={"PICK TEAM"}
                      onPress={() => this.createPlayerJSON()}
                    />
                  ) : (
                    <CustomButton
                      title={"PICK TEAMS"}
                      onPress={() => alert("Only two players can choose")}
                    />
                  )} */}

                    {/* <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("Team")}
                    style={{
                      backgroundColor: "#4850CF",
                      height: 50,
                      width: "70%",
                      borderRadius: 10,
                      marginTop: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 50,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 20,
                        marginRight: "3%",
                      }}
                    >
                      PICK TEAM
                    </Text>
                  </TouchableOpacity> */}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
