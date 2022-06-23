import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import HeaderArrow from "../../SmartComponent/Header/HeaderArrow";
import { ScrollView } from "react-native-gesture-handler";
import SegmentedControlTab from "react-native-segmented-control-tab";
import Spinner from "react-native-loading-spinner-overlay";
import { addgameplayerdata } from "../../utils/ConfigApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "native-base";

export default class PointChart extends Component {
  //addgameplayerdata
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      selectedIndex1: 0,
      selectedIndex2: 0,
      selectedIndex3: 0,
      PlayerData: [],
      backgroundColor: "white",
      backgroundColor1: "white",
      backgroundColor2: "white",
      backgroundColor3: "white",
      backgroundColor4: "white",
      backgroundColor5: "white",
      backgroundColor6: "white",
      backgroundColor7: "white",
      border: "#CA5328",

      border1: "#CA5328",

      border1: "#CA5328",

      border2: "#CA5328",
      border3: "#CA5328",
      color3: "#CA5328",
      border4: "#CA5328",

      border5: "#CA5328",

      border6: "#CA5328",

      border7: "#CA5328",
      color: "#CA5328",
      color1: "#CA5328",
      color2: "#CA5328",
      color4: "#CA5328",
      color5: "#CA5328",
      color6: "#CA5328",
      color7: "#CA5328",
      twoptmake: false, //
      twoptmiss: false, //
      threeptmake: false,
      threeptmiss: false,
      assistadd: false,
      turnoveradd: false,
      stealadd: false,
      reboundadd: false,
      twopointmake: 0,
      twopointmiss: 0,
      threepointmake: 0,
      threepointmiss: 0,
      assist: 0,
      turnover: 0,
      rebound: 0,
      steal: 0,
      isLoading: false,
      gameid: null,
      token: null,
      // button: {
      //   "2PTMAKE": {
      //     color: "white",
      //     title: "2PT Make",
      //     value: 0,
      //   },
      //   "2PTMISS": {
      //     color: "white",
      //     title: "2PT Miss",
      //     value: 0,
      //   },
      // },
    };
  }
  componentDidMount = () => {
    const { navigation } = this.props;
    this._unsubscribe = navigation.addListener("focus", () => {
      this.getGameId();
      this.getAccessToken();
      console.log("this.props.route.params.", this.props.route.params);
      this.setState(
        {
          PlayerData: this.props.route.params.item,
        },
        () => console.log(this.state.PlayerData)
      );
    });
  };
  componentWillUnmount() {
    this._unsubscribe;
    // BackHandler.removeEventListener(
  }
  getGameId = async () => {
    let gameid;
    try {
      gameid = await AsyncStorage.getItem("gameid");
      console.log("gameidcaptain", gameid);
      if (gameid !== null && gameid !== undefined && gameid !== "") {
        this.setState({
          gameid,
        });
      } else {
        console.log("no gameid found");
      }
    } catch (e) {
      console.log(e);
    }
    console.log("logingameid", gameid);
  };
  addGamePlayerData = async () => {
    // this.setState({ isLoading: true });
    const {
      twopointmake,
      twopointmiss,
      threepointmake,
      threepointmiss,
      assist,
      turnover,
      rebound,
      steal,
      PlayerData,
      gameid,
      token,
    } = this.state;

    // this.setState({ isLoading: true });
    let data = {
      GPT_GT_PkeyID: gameid,
      GPT_UserID: PlayerData.User_PkeyID,
      GPT_Point_Make: twopointmake != 0 ? twopointmake : threepointmake,
      GPT_Point_Miss: twopointmiss != 0 ? twopointmiss : threepointmiss,
      GPT_Assist: assist,
      GPT_Rebound: rebound,
      GPT_Steal: steal,
      GPT_Turnover: turnover,
      GPT_IsActive: 1,
      Type: 1,
    };
    console.log("player data:", data);
    await addgameplayerdata(data, token)
      .then((res) => {
        console.log("res: ", JSON.stringify(res));
        // this.props.navigation.goBack();
        this.props.navigation.navigate("LiveGame");
      })
      .catch((error) => {
        if (error.response) {
          console.log("responce_error", error.response);
          this.showMessage(error.response);
          this.setState({ isLoading: false });
        } else if (error.request) {
          this.showMessage(error.request);
          this.setState({ isLoading: false });
          console.log("request error", error.request);
        }
        this.showMessage("Server Error");
        this.setState({ isLoading: false });
      });
  };
  // handleIndexChange = (index) => {
  //   this.setState({
  //     ...this.state,
  //     selectedIndex: index,
  //   });
  // };
  // handleIndexChange1 = (index) => {
  //   this.setState({
  //     ...this.state,
  //     selectedIndex1: index,
  //   });
  // };
  // handleIndexChange2 = (index) => {
  //   this.setState({
  //     ...this.state,
  //     selectedIndex2: index,
  //   });
  // };
  // handleIndexChange3 = (index) => {
  //   this.setState({
  //     ...this.state,
  //     selectedIndex3: index,
  //   });
  // };
  getAccessToken = async () => {
    const { navigation } = this.props;
    let token;
    try {
      token = await AsyncStorage.getItem("token");
      console.log("tokenrightteam", token);
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
  showMessage = (message) => {
    if (message !== "" && message !== null && message !== undefined) {
      Toast.show({
        text: message,
        duration: 900,
        type: "success",
      });
    }
  };
  changeColor() {
    // if (!this.state.twoptmake) {
    this.setState(
      {
        twopointmake: 2,
        twopointmiss: 0,
        threepointmake: 0,
        threepointmiss: 0,
        assist: 0,
        turnover: 0,
        rebound: 0,
        steal: 0,
        twoptmake: true,
        // backgroundColor: "#4850CF",
        // border: "white",
        // color: "white",
      },
      () => this.addGamePlayerData()
    );
    // } else {
    //   this.setState({
    //     ...this.state,
    //     twopointmake: 0,
    //     twoptmake: false,
    //     backgroundColor: "white",
    //     border: "#CA5328",
    //     color: "#CA5328",
    //   });
    // }
    this.showMessage("2 Point Make");
  }

  changeColor1() {
    this.showMessage("2 Point Miss");
    // if (!this.state.twoptmiss) {
    this.setState(
      {
        twopointmake: 0,
        twopointmiss: 1,
        threepointmake: 0,
        threepointmiss: 0,
        assist: 0,
        turnover: 0,
        rebound: 0,
        steal: 0,
        twoptmiss: true,
        // backgroundColor1: "#4850CF",
        // border1: "white",
        // color1: "white",
      },
      () => this.addGamePlayerData()
    );
    // } else {
    //   this.setState({
    //     ...this.state,
    //     twoptmiss: false,
    //     twopointmiss: 0,
    //     backgroundColor1: "white",
    //     border1: "#CA5328",
    //     color1: "#CA5328",
    //   });
    // }
  }
  changeColor2() {
    this.showMessage("3 Point Miss");
    // if (!this.state.threeptmiss) {
    this.setState(
      {
        twopointmake: 0,
        twopointmiss: 0,
        threepointmake: 0,
        threepointmiss: 2,
        assist: 0,
        turnover: 0,
        rebound: 0,
        steal: 0,
        threeptmiss: true,
        // backgroundColor2: "#4850CF",
        // border2: "white",
        // color2: "white",
      },
      () => this.addGamePlayerData()
    );
    // } else {
    //   this.setState({
    //     ...this.state,
    //     threepointmiss: 0,
    //     threeptmiss: false,
    //     backgroundColor2: "white",
    //     border2: "#CA5328",
    //     color2: "#CA5328",
    //   });
    // }
  }
  changeColor3() {
    this.showMessage("3 Point Make");
    // if (!this.state.threeptmake) {
    this.setState(
      {
        twopointmake: 0,
        twopointmiss: 0,
        threepointmake: 3,
        threepointmiss: 0,
        assist: 0,
        turnover: 0,
        rebound: 0,
        steal: 0,
        threeptmake: true,
        // backgroundColor3: "#4850CF",
        // border3: "white",
        // color3: "white",
      },
      () => this.addGamePlayerData()
    );
    // } else {
    //   this.setState({
    //     ...this.state,
    //     threepointmake: 0,
    //     threeptmake: false,
    //     backgroundColor3: "white",
    //     border3: "#CA5328",
    //     color3: "#CA5328",
    //   });
    // }
  }
  changeColor4() {
    this.showMessage("Assist selected");
    // if (!this.state.assistadd) {
    this.setState(
      {
        twopointmake: 0,
        twopointmiss: 0,
        threepointmake: 0,
        threepointmiss: 0,
        assist: 1,
        turnover: 0,
        rebound: 0,
        steal: 0,
        assistadd: true,
        // backgroundColor4: "#4850CF",
        // border4: "white",
        // color4: "white",
      },
      () => this.addGamePlayerData()
    );
    // } else {
    //   this.setState({
    //     ...this.state,
    //     assist: 0,
    //     assistadd: false,
    //     backgroundColor4: "white",
    //     border4: "#CA5328",
    //     color4: "#CA5328",
    //   });
    // }
  }
  changeColor5() {
    this.showMessage("Turnover selected");
    // if (!this.state.turnoveradd) {
    this.setState(
      {
        twopointmake: 0,
        twopointmiss: 0,
        threepointmake: 0,
        threepointmiss: 0,
        assist: 0,
        turnover: 1,
        rebound: 0,
        steal: 0,
        turnoveradd: true,
        // backgroundColor5: "#4850CF",
        // border5: "white",
        // color5: "white",
      },
      () => this.addGamePlayerData()
    );
    // } else {
    //   this.setState({
    //     ...this.state,
    //     turnover: 0,
    //     turnoveradd: false,
    //     backgroundColor5: "white",
    //     border5: "#CA5328",
    //     color5: "#CA5328",
    //   });
    // }
  }
  changeColor6() {
    this.showMessage("Rebound selected");
    // if (!this.state.reboundadd) {
    this.setState(
      {
        twopointmake: 0,
        twopointmiss: 0,
        threepointmake: 0,
        threepointmiss: 0,
        assist: 0,
        turnover: 0,
        rebound: 1,
        steal: 0,
        reboundadd: true,
        // backgroundColor6: "#4850CF",
        // border6: "white",
        // color6: "white",
      },
      () => this.addGamePlayerData()
    );
    // } else {
    //   this.setState({
    //     ...this.state,
    //     rebound: 0,
    //     reboundadd: false,
    //     backgroundColor6: "white",
    //     border6: "#CA5328",
    //     color6: "#CA5328",
    //   });
    // }
  }
  changeColor7() {
    this.showMessage("Steal selected");
    // if (!this.state.stealadd) {
    this.setState(
      {
        twopointmake: 0,
        twopointmiss: 0,
        threepointmake: 0,
        threepointmiss: 0,
        assist: 0,
        turnover: 0,
        rebound: 0,
        steal: 1,
        stealadd: true,
        // backgroundColor7: "#4850CF",
        // border7: "white",
        // color7: "white",
      },
      () => this.addGamePlayerData()
    );
    // } else {
    //   this.setState({
    //     ...this.state,
    //     steal: 0,
    //     stealadd: false,
    //     backgroundColor7: "white",
    //     border7: "#CA5328",
    //     color7: "#CA5328",
    //   });
    // }
  }
  render() {
    console.log("state : ", this.state.gameid);
    const { isLoading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={isLoading} />
        <SafeAreaView>
          <HeaderArrow
            icon="arrowleft"
            navigation={this.props.navigation}
            title="Add stats"
          />
          <ScrollView>
            <View style={{ flex: 1 }}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View
                  style={{
                    marginTop: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 200,
                    // width: 200,
                    // backgroundColor: "pink",
                    borderRadius: 150,
                    elevation: 3,
                  }}
                >
                  <Image
                    style={{
                      height: 200,
                      width: 200,
                      borderRadius: 100,
                    }}
                    source={{
                      uri: this.state.PlayerData.User_Image_Path
                        ? this.state.PlayerData.User_Image_Path
                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/1200px-Unknown_person.jpg",
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontFamily: "KanedaGothic-BoldItalic",
                    color: "#2f363c",
                    fontSize: 50,
                  }}
                >
                  {this.state.PlayerData.User_Name}
                </Text>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    // backgroundColor: "pink",
                    justifyContent: "space-evenly",
                    marginTop: 20,
                  }}
                >
                  {/* {Object.keys(this.state.button).map(function (key) {
                  // return console.log(this.state.button[key]);
                return(
                    <View style={{ width: "45%" }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: this.state.button[key].color,
                        padding: 15,
                        alignItems: "center",
                        borderColor: this.state.border,
                      }}
                      onPress={() => this.changeColor()}
                    >
                      <Text style={styles.text}>
                        {this.state.button[key].title}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )
                })} */}
                  <View style={{ width: "45%" }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: this.state.backgroundColor,
                        padding: 15,
                        alignItems: "center",
                        borderColor: this.state.border,
                        borderWidth: 1,
                        borderRadius: 10,
                      }}
                      onPress={() => this.changeColor()}
                    >
                      <Text
                        style={{
                          color: this.state.color,
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        2 PT MAKE
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: "45%" }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: this.state.backgroundColor1,
                        padding: 15,
                        alignItems: "center",
                        borderColor: this.state.border1,
                        borderWidth: 1,
                        borderRadius: 10,
                      }}
                      onPress={() => this.changeColor1()}
                    >
                      <Text
                        style={{
                          color: this.state.color1,
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        2 PT MISS
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    // backgroundColor: "pink",
                    justifyContent: "space-evenly",
                    marginTop: 20,
                  }}
                >
                  <View style={{ width: "45%" }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: this.state.backgroundColor3,
                        padding: 15,
                        alignItems: "center",
                        borderColor: this.state.border3,
                        borderWidth: 1,
                        borderRadius: 10,
                      }}
                      onPress={() => this.changeColor3()}
                    >
                      <Text
                        style={{
                          color: this.state.color3,
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        3 PT MAKE
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: "45%" }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: this.state.backgroundColor2,
                        borderColor: this.state.border2,
                        padding: 15,
                        alignItems: "center",
                        borderWidth: 1,
                        borderRadius: 10,
                      }}
                      onPress={() => this.changeColor2()}
                    >
                      <Text
                        style={{
                          color: this.state.color2,
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        3PT MISS
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    // backgroundColor: "pink",
                    justifyContent: "space-evenly",
                    marginTop: 20,
                  }}
                >
                  <View style={{ width: "45%" }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: this.state.backgroundColor4,
                        padding: 15,
                        alignItems: "center",
                        borderColor: this.state.border4,
                        borderWidth: 1,
                        borderRadius: 10,
                      }}
                      onPress={() => this.changeColor4()}
                    >
                      <Text
                        style={{
                          color: this.state.color4,
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        ASSIST
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: "45%" }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: this.state.backgroundColor5,
                        padding: 15,
                        alignItems: "center",
                        borderColor: this.state.border5,
                        borderWidth: 1,
                        borderRadius: 10,
                      }}
                      onPress={() => this.changeColor5()}
                    >
                      <Text
                        style={{
                          color: this.state.color5,
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        TURNOVER
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    // backgroundColor: "pink",
                    justifyContent: "space-evenly",
                    marginTop: 20,
                    marginBottom: 150,
                  }}
                >
                  <View style={{ width: "45%" }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: this.state.backgroundColor6,
                        padding: 15,
                        alignItems: "center",
                        borderColor: this.state.border6,
                        borderWidth: 1,
                        borderRadius: 10,
                      }}
                      onPress={() => this.changeColor6()}
                    >
                      <Text
                        style={{
                          color: this.state.color6,
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        REBOUND
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: "45%" }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: this.state.backgroundColor7,
                        padding: 15,
                        alignItems: "center",
                        borderColor: this.state.border7,
                        borderWidth: 1,
                        borderRadius: 10,
                      }}
                      onPress={() => this.changeColor7()}
                    >
                      <Text
                        style={{
                          color: this.state.color7,
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        STEAL
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {/* <View
              style={{
                alignItems: "center",
                marginTop: 20,
                // backgroundColor: "pink",
              }}
            >
              <View
                style={{
                  width: "90%",
                  // backgroundColor: "red",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SegmentedControlTab
                  values={["2 PT MAKE", "2 PT MISS"]}
                  borderRadius={10}
                  activeTabStyle={styles.activeTabStyle}
                  tabStyle={{
                    borderColor: "#CA5328",
                    // borderWidth: 2,
                    // marginLeft: 20,
                    borderRadius: 10,
                  }}
                  lastTabStyle={{
                    borderLeftWidth: 2,
                    borderLeftColor: "#4850CF",
                  }}
                  tabsContainerStyle={{
                    height: 55,
                  }}
                  tabTextStyle={{
                    color: "#CA5328",
                    fontWeight: "bold",
                    fontSize: 12,
                  }}
                  selectedIndex={this.state.selectedIndex}
                  onTabPress={this.handleIndexChange}
                />
              </View>
            </View>
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <View style={{ width: "90%" }}>
                <SegmentedControlTab
                  values={["3 PT MAKE", "3 PT MISS"]}
                  borderRadius={10}
                  activeTabStyle={styles.activeTabStyle}
                  tabStyle={{
                    borderColor: "#CA5328",
                    // borderWidth: 2,
                    // marginLeft: 20,
                    borderRadius: 10,
                  }}
                  lastTabStyle={{
                    borderLeftWidth: 2,
                    borderLeftColor: "#4850CF",
                  }}
                  tabsContainerStyle={{
                    height: 55,
                  }}
                  tabTextStyle={{
                    color: "#CA5328",
                    fontWeight: "bold",
                    fontSize: 12,
                  }}
                  selectedIndex={this.state.selectedIndex1}
                  onTabPress={this.handleIndexChange1}
                />
              </View>
            </View>
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <View style={{ width: "90%" }}>
                <SegmentedControlTab
                  values={["ASSIST", "TURNOVER"]}
                  borderRadius={10}
                  activeTabStyle={styles.activeTabStyle}
                  tabStyle={{
                    borderColor: "#CA5328",

                    // borderWidth: 2,
                    // marginLeft: 20,
                    borderRadius: 10,
                  }}
                  lastTabStyle={{
                    borderLeftWidth: 2,
                    borderLeftColor: "#4850CF",
                  }}
                  tabsContainerStyle={{
                    height: 55,
                  }}
                  tabTextStyle={{
                    color: "#CA5328",
                    fontWeight: "bold",
                    fontSize: 12,
                  }}
                  selectedIndex={this.state.selectedIndex2}
                  onTabPress={this.handleIndexChange2}
                />
              </View>
            </View>
            <View
              style={{
                alignItems: "center",
                marginTop: 20,
                marginBottom: 50,
              }}
            >
              <View style={{ width: "90%" }}>
                <View
                  style={{
                    flexDirection: "row",
                    // backgroundColor: "pink",
                  }}
                >
                  <View style={{ width: "50%", marginLeft: "2%" }}>
                    <SegmentedControlTab
                      values={["REBOUND"]}
                      borderRadius={10}
                      activeTabStyle={styles.activeTabStyle}
                      tabStyle={{
                        borderColor: "#CA5328",
                        // borderWidth: 2,
                        // marginLeft: 20,
                        borderRadius: 10,
                      }}
                      lastTabStyle={{
                        borderLeftWidth: 2,
                        borderLeftColor: "#4850CF",
                      }}
                      tabsContainerStyle={{
                        height: 55,
                      }}
                      tabTextStyle={{
                        color: "#CA5328",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                      selectedIndex={this.state.selectedIndex3}
                      onTabPress={this.handleIndexChange3}
                    />
                  </View>
                  <View style={{ width: "49%" }}>
                    <SegmentedControlTab
                      values={["STEAL"]}
                      borderRadius={10}
                      activeTabStyle={{
                        backgroundColor: "#4850CF",
                        borderColor: "#4850CF",
                        color: "white",
                        fontWeight: "bold",
                      }}
                      tabStyle={{
                        borderColor: "#CA5328",
                        // borderWidth: 2,
                        // marginLeft: 20,
                        borderRadius: 10,
                      }}
                      lastTabStyle={{
                        borderLeftWidth: 2,
                        borderLeftColor: "#4850CF",
                      }}
                      tabsContainerStyle={{
                        height: 55,
                      }}
                      tabTextStyle={{
                        color: "#CA5328",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                      selectedIndex={this.state.selectedIndex4}
                      onTabPress={this.handleIndexChange4}
                    />
                  </View> */}
              {/* </View> */}
              {/* </View> */}
              {/* </View> */}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  text: {
    color: "white",
  },
  activeTabStyle: {
    backgroundColor: "#4850CF",
    marginRight: "3%",
    marginLeft: "3%",
    borderColor: "#4850CF",
    color: "white",
    fontWeight: "bold",
  },
  text: { color: "#484848", fontSize: 15 },
  tabsContainerStyle: { height: 45, borderColor: "#4850CF" },
  tabTextStyle: { color: "gray" },
  tabStyle: { borderColor: "#4850CF", borderWidth: 2 },
  viewStyle2: { alignItems: "center", marginTop: 13 },
});
