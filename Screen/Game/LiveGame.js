import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
  Alert,
  Modal,
  Dimensions,
  TextInput,
} from "react-native";
// import HeaderArrow from "../../SmartComponent/Header/HeaderArrow";
import Header from "../../SmartComponent/Header/Header";
import { ScrollView } from "react-native-gesture-handler";
import {
  getteamdata,
  releasplayerdata,
  gamescoredatail,
} from "../../utils/ConfigApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../SmartComponent/CustomButton";
import Spinner from "react-native-loading-spinner-overlay";
import Feather from "react-native-vector-icons/Feather";
import { showTabBar1 } from "../../store/action/tabbar/action";
import { connect } from "react-redux";
const { height } = Dimensions.get("window");
const modalMargin = height / 3.5;

class LiveGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listPlayer: [],
      gameid: null,
      token: null,
      activeIndex: 0,
      width: 0,
      color: "blue",
      index: 0,
      score_pattern: 0,
      win_pattern: 0,
      time: 10,
      flag: 0,
      gameover: 0,
      UserDataLeft: [],
      UserDataRight: [],
      teamonescore: 0,
      teamtwoscore: 0,

      isLoading: false,
      isVisible: false,
      seconds: 0,
      extime: null,
      timer: null,
      exsec: null,
      disable: false,
      editdisable: true,
      stopdisable: true,
      startdisable: false,
      // data: [
      //   { img: "https://reactnative.dev/img/tiny_logo.png", id: 1 },
      //   { img: "https://reactnative.dev/img/tiny_logo.png", id: 2 },
      //   { img: "https://reactnative.dev/img/tiny_logo.png", id: 3 },
      //   { img: "https://reactnative.dev/img/tiny_logo.png", id: 4 },
      //   { img: "https://reactnative.dev/img/tiny_logo.png", id: 5 },
      //   { img: "https://reactnative.dev/img/tiny_logo.png", id: 6 },
      // ],
    };

    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentDidMount = async () => {
    this.getGmaeId();
    this.getAccessToken();
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.GameScoreDetail();
      this.gamescore = setInterval(() => this.GameScoreDetail, 30000);
    });
  };

  onStart = () => {
    // alert("hiii");
    this.setState({
      startdisable: true,
      editdisable: true,
      disable: false,
      stopdisable: false,
    });
    this.myInterval = setInterval(() => {
      const { seconds, time } = this.state;
      if (seconds > 0) {
        this.setState({
          startdisable: true,
          editdisable: true,
          disable: false,
          stopdisable: false,
          seconds: seconds - 1,
        });
      }
      if (seconds === 0) {
        if (time === 0) {
          clearInterval(this.myInterval);
          clearInterval(this.gamescore);
          this.setState({
            disable: true,
          });
        } else {
          this.setState({
            time: time - 1,
            seconds: 59,
          });
        }
      }
    }, 1000);
  };
  onStop = () => {
    clearInterval(this.myInterval);
    this.setState({
      startdisable: false,
      editdisable: false,
      disable: true,
    });
  };
  onSetUpdatetime = () => {
    // alert(this.state.extime);
    // this.setState({
    //   isVisible: false,
    //   time: this.state.time + this.state.extime,
    // });
    let totalsec = this.state.seconds + this.state.exsec;
    var seconds = parseInt(totalsec, 10); // don't forget the second param
    let hours = Math.floor(totalsec / 3600); // get hours
    let minutes = Math.floor((totalsec - hours * 3600) / 60);
    seconds = seconds - hours * 3600 - minutes * 60;
    // console.log(`minutes : ${minutes},seconds: ${seconds}`);
    // alert(`minutes : ${minutes},seconds: ${seconds}`);
    this.setState({
      isVisible: false,
      time: this.state.time + minutes + this.state.extime,
      seconds,
    });

    // if (this.state.extime < this.state.time) {
    //   this.setState({
    //     isVisible: false,
    //     time: this.state.time + this.state.extime,
    //     // seconds: this.state.seconds + this.state.exsec,
    //   });
    // } else {
    //   alert("Please Enter Valid  Minutes ");
    // }
    // if (this.state.exsec < this.state.seconds) {
    //   this.setState({
    //     isVisible: false,
    //     // time: this.state.time + this.state.extime,
    //     seconds: this.state.seconds + this.state.exsec,
    //   });
    // } else {
    //   alert("Please Enter Valid  Seconds ");
    // }
  };
  componentWillUnmount() {
    // BackHandler.removeEventListener(
    //   "hardwareBackPress",
    //   this.handleBackButtonClick
    // );
    clearInterval(this.myInterval);
    clearInterval(this.state.timer);
    clearInterval(this.gamescore);
  }
  // handleBackButtonClick() {
  //   this.props.navigation.goBack(null);
  //   return true;
  // }
  getGmaeId = async () => {
    let gameid;
    try {
      gameid = await AsyncStorage.getItem("gameid");
      console.log("teamgameid", gameid);
      if (gameid !== null && gameid !== undefined && gameid !== "") {
        this.setState(
          {
            gameid,
          },
          () => this.getTeamData()
        );
      } else {
        console.log("no token found");
      }
    } catch (e) {
      console.log(e);
    }
  };
  getAccessToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem("token");
      console.log("teamgameid", token);
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
  getTeamData = async () => {
    this.setState({ isLoading: true });
    let data = {
      Game_PkeyID: this.state.gameid,
      Type: 1,
    };
    console.log("datateam", data);
    await getteamdata(data, this.state.token)
      .then((res) => {
        console.log("res:settingdata ", res[0]);
        // try {
        //   AsyncStorage.setItem("gameover", res[0].Game_Over.toString());
        //   AsyncStorage.setItem("flag", res[0].Game_Score_Flag.toString());
        //   AsyncStorage.setItem(
        //     "game_score_pattern",
        //     res[0].Game_Score_pattern.toString()
        //   );
        //   AsyncStorage.setItem("game_time", res[0].Game_Time.toString());
        //   AsyncStorage.setItem(
        //     "game_win_pattern",
        //     res[0].Game_win_pattern.toString()
        //   );
        // } catch (e) {
        //   console.log(e);
        // }
        this.setState(
          {
            UserDataLeft: res[0].UserListLeft,
            UserDataRight: res[0].UserListRight,
            isLoading: false,
            gameover: res[0].Game_Over,
            flag: res[0].Game_Score_Flag,
            time: res[0].Game_Time,
            win_pattern: res[0].Game_win_pattern,
            score_pattern: res[0].Game_Score_pattern,
          },
          () => this.onCheckflag()
        );
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
  };
  onCheckflag = () => {
    if (this.state.flag === 2) {
      this.setState({ disable: true });
    }
  };
  EndGame = async () => {
    console.log("token", this.state.token);
    this.setState({ isLoading: true });
    let data = {
      GT_Game_PkeyID: parseInt(this.state.gameid),
      Type: 1,
    };
    console.log("EndGame", data);
    await releasplayerdata(data, this.state.token)
      .then((res) => {
        console.log("res1234: ", res);
        clearInterval(this.myInterval);
        clearInterval(this.gamescore);
        this.props.showTabBar1(false);
        this.props.navigation.navigate("FinalStats", { data: res });
        this.setState({ isLoading: false });
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
  };
  GameScoreDetail = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 3,
      GT_Game_PkeyID: this.state.gameid,
    };
    console.log("datateam", data);
    await gamescoredatail(data, this.state.token)
      .then((res) => {
        console.log("res: GameScoreDetail", res[0][0]);
        this.setState(
          {
            teamonescore: res[0][0].GT_Left_TeamScore
              ? res[0][0].GT_Left_TeamScore
              : 0,
            teamtwoscore: res[0][0].GT_Right_TeamScore
              ? res[0][0].GT_Right_TeamScore
              : 0,
          },
          () => this.onCheckGameScore()
        );
        this.setState({ isLoading: false });
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
  };
  onCheckGameScore = () => {
    if (this.state.teamonescore >= this.state.gameover) {
      if (this.state.win_pattern === 2) {
        let result = this.state.teamonescore - this.state.teamtwoscore;
        if (result === 2) {
          this.setState({
            disable: true,
          });
        }
      } else {
        this.setState({
          disable: true,
        });
      }
    } else if (this.state.teamtwoscore >= this.state.gameover) {
      if (this.state.win_pattern === 2) {
        let result = this.state.teamtwoscore - this.state.teamonescore;
        if (result === 2) {
          this.setState({
            disable: true,
          });
        }
      } else {
        this.setState({
          disable: true,
        });
      }
    }
  };
  onMinuteChange = (time) => {
    this.setState({ extime: parseInt(time) });
  };
  onSecondChange = (seconds) => {
    this.setState({ exsec: parseInt(seconds) });
  };

  renderModal = () => {
    return (
      <Modal
        animationType={"fade"}
        style={{ justifyContent: "center", alignItems: "center" }}
        transparent={true}
        visible={this.state.isVisible}
        onRequestClose={() => {
          console.log("Modal has been closed.");
        }}
      >
        {/*All views of Modal*/}

        <View
          style={{
            backgroundColor: "#ffffff",
            marginHorizontal: 20,
            marginTop: modalMargin,
            borderColor: "#4850CF",
            borderWidth: 1,
          }}
        >
          <View
            style={{
              justifyContent: "flex-end",
              // backgroundColor: "red",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  isVisible: false,
                })
              }
              style={{
                borderWidth: 1,
                borderColor: "#4850CF",
                borderRadius: 20,
                width: "10%",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                marginRight: 10,
              }}
            >
              <Feather
                name="x"
                size={30}
                style={{
                  color: "#4850CF",
                  // textAlign: "left",
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <View style={{ paddingVertical: 20 }}>
              <Text>Enter Minute</Text>
            </View>
            <View
              style={{ borderColor: "gray", borderWidth: 1, borderRadius: 20 }}
            >
              <TextInput
                placeholder="Enter Minute"
                placeholderTextColor="gray"
                onChangeText={this.onMinuteChange}
                keyboardType="numeric"
                style={{ paddingLeft: 10, height: 50 }}
              />
            </View>
            <View style={{ paddingVertical: 20 }}>
              <Text>Enter Second</Text>
            </View>
            <View
              style={{ borderColor: "gray", borderWidth: 1, borderRadius: 20 }}
            >
              <TextInput
                placeholder="Enter Second"
                placeholderTextColor="gray"
                onChangeText={this.onSecondChange}
                keyboardType="numeric"
                style={{ paddingLeft: 10, height: 50 }}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => this.onSetUpdatetime()}
                style={{
                  backgroundColor: "#4850CF",
                  height: 50,
                  width: "70%",
                  borderRadius: 10,
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 50,
                  // borderWidth: 3,
                  // borderColor: "black",
                  // zIndex: 5000,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    marginRight: "3%",
                  }}
                >
                  Add Time
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  render() {
    console.log(this.state.editdisable);

    const { isLoading } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <SafeAreaView>
          {/* <HeaderArrow  */}
          <Header title="Live game" navigation={this.props.navigation} />
          <ScrollView>
            <Spinner visible={isLoading} />

            {this.state.flag === 1 ? (
              <View>
                <View
                  style={{
                    // backgroundColor: "red",
                    alignItems: "center",
                    marginTop: 30,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "muro",
                      fontWeight: "bold",
                      fontSize: 25,
                      color: "#4850CF",
                    }}
                  >
                    Points needed to win - {this.state.gameover}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: "pink",
                  }}
                >
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      // backgroundColor: "red",
                      alignItems: "center",
                      width: "80%",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontFamily: "muro",
                          fontWeight: "bold",
                          fontSize: 100,
                          color: "#CA5328",
                          // fontStyle: "italic",
                        }}
                      >
                        {this.state.teamonescore}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: "muro",
                          // fontFamily: "KanedaGothic-BoldItalic",
                          fontSize: 150,
                          color: "#CA5328",
                        }}
                      >
                        -
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: "muro",
                          fontWeight: "bold",
                          fontSize: 100,
                          color: "#CA5328",
                          // fontStyle: "italic",
                        }}
                      >
                        {this.state.teamtwoscore}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <View
                  style={{
                    marginTop: 30,
                    alignItems: "center",
                    // backgroundColor: "red",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: "muro",
                        fontWeight: "bold",
                        // fontFamily: "KanedaGothic-BoldItalic",
                        fontSize: 70,
                        color: "#4850CF",
                      }}
                    >
                      {this.state.time}:
                      {this.state.seconds < 10
                        ? `0${this.state.seconds}`
                        : this.state.seconds}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: 20,
                  }}
                >
                  <View>
                    <TouchableOpacity
                      disabled={this.state.editdisable}
                      onPress={() =>
                        this.setState({
                          isVisible: true,
                          extime: 0,
                          exsec: 0,
                        })
                      }
                      style={{
                        backgroundColor: "#4850CF",
                        height: 50,
                        width: 100,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                      }}
                    >
                      <Text style={{ color: "white" }}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{}}>
                    <TouchableOpacity
                      disabled={this.state.startdisable}
                      onPress={() => this.onStart()}
                      style={{
                        backgroundColor: "#4850CF",
                        height: 50,
                        width: 100,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                      }}
                    >
                      <Text style={{ color: "white" }}>Start</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      disabled={this.state.stopdisable}
                      onPress={() => this.onStop()}
                      style={{
                        backgroundColor: "#4850CF",
                        height: 50,
                        width: 100,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                      }}
                    >
                      <Text style={{ color: "white" }}>Stop</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      //    backgroundColor:'#CA5328',
                      width: "70%",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontFamily: "muro",
                          fontWeight: "bold",
                          // fontFamily: "KanedaGothic-BoldItalic",
                          fontSize: 100,
                          color: "#CA5328",
                        }}
                      >
                        {this.state.teamonescore}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: "muro",
                          fontWeight: "bold",
                          // fontFamily: "KanedaGothic-BoldItalic",
                          fontSize: 100,
                          color: "#CA5328",
                        }}
                      >
                        -
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: "muro",
                          fontWeight: "bold",
                          // fontFamily: "KanedaGothic-BoldItalic",
                          fontSize: 100,
                          color: "#CA5328",
                          // fontStyle: "italic",
                        }}
                      >
                        {this.state.teamtwoscore}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  // backgroundColor: "pink",
                  width: "70%",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                    }}
                  >
                    Team 1
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                    }}
                  >
                    Team 2
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: "50%" }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.UserDataLeft}
                  renderItem={({ item, index }) => {
                    // this.renderItem(item,index)
                    return (
                      <View
                        style={{
                          marginTop: 50,
                          // // backgroundColor: "pink",
                          // width: "50%",
                        }}
                      >
                        <View>
                          <TouchableOpacity
                            disabled={this.state.disable}
                            onPress={() =>
                              this.props.navigation.navigate("PointChart", {
                                item: item,
                              })
                            }
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                              // backgroundColor: "red",
                            }}
                          >
                            <Image
                              style={{
                                height: 150,
                                width: 150,
                                borderRadius: 75,
                              }}
                              source={{
                                uri: item.User_Image_Path
                                  ? item.User_Image_Path
                                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/1200px-Unknown_person.jpg",
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 20,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 20,
                              fontFamily: "muro",
                              fontWeight: "bold",
                              color: "#4850CF",
                            }}
                          >
                            {item.User_Name}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                  keyExtractor={(item) => item.id}
                />
              </View>
              <View style={{ width: "50%" }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.UserDataRight}
                  renderItem={({ item, index }) => {
                    // this.renderItem(item,index)
                    return (
                      <View
                        style={{
                          marginTop: 50,
                          // // backgroundColor: "pink",
                          // width: "50%",
                        }}
                      >
                        <View>
                          <TouchableOpacity
                            disabled={this.state.disable}
                            onPress={() =>
                              this.props.navigation.navigate("PointChart", {
                                item: item,
                              })
                            }
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                              // backgroundColor: "red",
                            }}
                          >
                            <Image
                              style={{
                                height: 150,
                                width: 150,
                                borderRadius: 75,
                              }}
                              source={{
                                uri: item.User_Image_Path
                                  ? item.User_Image_Path
                                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/1200px-Unknown_person.jpg",
                              }}
                              // source={{ uri: item.User_Image_Path }}
                            />
                          </TouchableOpacity>
                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: 20,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                color: "#4850CF",
                                textTransform: "capitalize",
                              }}
                            >
                              {item.User_Name}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                  keyExtractor={(item) => item.id}
                />
              </View>
            </View>
            {/* <View
            style={{
              // marginHorizontal: "1%",
              flex: 1,
              // backgroundColor: "pink",
              marginBottom: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.data}
              renderItem={({ item, index }) => {
                // this.renderItem(item,index)
                return (
                  <View
                    style={{
                      marginTop: 50,
                      // backgroundColor: "pink",
                      width: "50%",
                    }}
                  >
                    <TouchableOpacity onPress={() => alert("hiii")}>
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          // backgroundColor: "red",
                        }}
                      >
                        <Image
                          style={{
                            height: 150,
                            width: 150,
                            borderRadius: 75,
                          }}
                          source={{ uri: item.img }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
              keyExtractor={(item) => item.id}
            />
          </View> */}
            <View
              style={{
                alignItems: "center",
                marginBottom: 100,
                marginTop: 50,
                // backgroundColor: "red",
              }}
            >
              <CustomButton
                title={"END GAME"}
                onPress={() => this.EndGame()}
                // onPress={() =>
                //   this.props.navigation.navigate("TeamRight", {
                //     gameId: this.state.gameid,
                //   })
                // }
              />
              {/* <TouchableOpacity
                onPress={() => this.props.navigation.navigate("PointChart")}
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
                  style={{ color: "white", fontSize: 20, marginRight: "3%" }}
                >
                  END GAME
                </Text>
              </TouchableOpacity> */}
            </View>
            {this.renderModal()}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  // token: state.authReducer.token,
  // parentid: state.parentidReducer.parentid,
});

const mapDispatchToProps = {
  showTabBar1,
};
export default connect(mapStateToProps, mapDispatchToProps)(LiveGame);
