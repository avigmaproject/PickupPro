import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
} from "react-native";
import HeaderArrow from "../../SmartComponent/Header/HeaderArrow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getplayerdata } from "../../utils/ConfigApi";
export default class PlayerProfile extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      average: null,
      gameplayed: null,
      gamewon: null,
      percentage: null,
      score: null,
      user_image_path: null,
      username: null,
      rebound: null,
      turnover: null,
      assist: null,
      overallshooting: null,
      twopointshooting: null,
      threepointshooting: null,
      averageproscore: null,
      mvp: null,
    };
  }

  // componentWillUnmount() {
  //   console.log("backplayerprofile");
  //   BackHandler.removeEventListener(
  //     "hardwareBackPress",
  //     this.handleBackButtonClick
  //   );
  // }

  // handleBackButtonClick() {
  //   this.props.navigation.goBack(null);
  //   return true;
  // }
  componentDidMount = async () => {
    console.log("thisisisisi", this.props.route.params);
    const { UserId } = this.props.route.params;
    this.setState(
      {
        UserId,
      },
      () => this.getAccessToken()
    );
  };
  getAccessToken = async () => {
    const { navigation } = this.props;
    let token;
    try {
      token = await AsyncStorage.getItem("token");
      // console.log("tokenrightteam", token);
      if (token !== null && token !== undefined && token !== "") {
        this.setState(
          {
            token,
          },
          () => this.GetPlayerData()
        );
      } else {
        console.log("no token found");
      }
    } catch (e) {
      console.log(e);
    }
    // console.log("logintoken", token);
  };
  GetPlayerData = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 1,
      PT_UserId: this.state.UserId,
      // PUserID: ,
    };
    console.log("datagame", data);
    await getplayerdata(data, this.state.token)
      .then((res) => {
        console.log("res:getplayerdata ", res);
        this.setState({
          average: res[0].Average,
          gameplayed: res[0].GamePlayed,
          gamewon: res[0].GameWon,
          percentage: res[0].PerCentage,
          score: res[0].Score,
          user_image_path: res[0].User_Image_Path,
          username: res[0].User_Name,
          rebound: res[0].AvgRebound,
          assist: res[0].AvgAssist,
          turnover: res[0].AvgTurnover,
          overallshooting: res[0].Overallshooting,
          twopointshooting: res[0].Twopointshooting,
          threepointshooting: res[0].Threepointshooting,
          averageproscore: res[0].AvgProScore,
          mvp: res[0].MVP,
        });
      })
      .catch((error) => {
        if (error.request) {
          console.log(error.request);
          this.setState({ isLoading: false });
        }
        if (error.response) {
          console.log(error.response);
          this.setState({ isLoading: false });
        }
        console.log("im in catch");
        console.log(error);
        this.setState({ isLoading: false });
      });
  };
  render() {
    return (
      <View style={{ backgroundColor: "white" }}>
        <SafeAreaView>
          <HeaderArrow title="Profile" navigation={this.props.navigation} />
          <ScrollView>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 200,
              }}
            >
              <View
                style={{
                  // elevation: 20,
                  marginTop: 40,
                }}
              >
                <Image
                  style={{
                    height: 150,
                    width: 150,
                    borderRadius: 75,
                    // elevation: 20,
                  }}
                  source={{
                    uri: this.state.user_image_path
                      ? this.state.user_image_path
                      : "https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg",
                  }}
                />
              </View>
              <View style={{ alignItems: "center", marginTop: 10 }}>
                <Text
                  style={{
                    fontSize: 30,
                    // fontFamily: "KanedaGothic-BoldItalic",
                    fontFamily: "muro",
                    fontWeight: "bold",
                    color: "#2f363c",
                    textTransform: "capitalize",
                  }}
                >
                  {this.state.username}
                </Text>
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
                  flexDirection: "row",
                  // backgroundColor: "red",
                  width: "80%",
                  justifyContent: "space-between",
                  height: 50,
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontFamily: "KanedaGothic-BoldItalic",
                    fontSize: 20,
                    color: "#2f363c",
                  }}
                >
                  Games Played
                </Text>
                <View
                  style={{
                    width: "25%",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    paddingRight: 30,
                  }}
                >
                  <Text
                    style={{
                      // marginRight: 10,
                      fontFamily: "muro",
                      fontWeight: "bold",
                      // fontFamily: "KanedaGothic-BoldItalic",
                      fontSize: 20,
                      color: "#4850CF",
                    }}
                  >
                    {this.state.gameplayed ? this.state.gameplayed : 0}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#ebeced",
                  width: "80%",
                  justifyContent: "space-between",
                  height: 50,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontFamily: "KanedaGothic-BoldItalic",
                    fontSize: 20,
                    color: "#2f363c",
                  }}
                >
                  Games Won
                </Text>
                <View
                  style={{
                    width: "25%",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    paddingRight: 30,
                  }}
                >
                  <Text
                    style={{
                      // marginRight: 10,
                      fontFamily: "muro",
                      fontWeight: "bold",
                      // fontFamily: "KanedaGothic-BoldItalic",
                      fontSize: 20,
                      color: "#4850CF",
                    }}
                  >
                    {this.state.gamewon ? this.state.gamewon : 0}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  // backgroundColor: "lightgray",
                  width: "80%",
                  justifyContent: "space-between",
                  height: 50,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontFamily: "KanedaGothic-BoldItalic",
                    fontSize: 20,
                    color: "#2f363c",
                  }}
                >
                  Winning%
                </Text>
                <View
                  style={{
                    width: "25%",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "muro",
                      fontWeight: "bold",
                      // fontFamily: "KanedaGothic-BoldItalic",
                      fontSize: 20,
                      color: "#4850CF",
                    }}
                  >
                    {this.state.percentage ? this.state.percentage : 0}%
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#ebeced",
                  width: "80%",
                  justifyContent: "space-between",
                  height: 50,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontFamily: "KanedaGothic-BoldItalic",
                    fontSize: 20,
                    color: "#2f363c",
                  }}
                >
                  Average Pro Score
                </Text>
                <View
                  style={{
                    width: "25%",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    paddingRight: 30,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "muro",
                      fontWeight: "bold",
                      // fontFamily: "KanedaGothic-BoldItalic",
                      fontSize: 20,
                      color: "#4850CF",
                    }}
                  >
                    {this.state.averageproscore
                      ? this.state.averageproscore
                      : 0}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  // backgroundColor: "lightgray",
                  width: "80%",
                  justifyContent: "space-between",
                  height: 50,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontFamily: "KanedaGothic-BoldItalic",
                    fontSize: 20,
                    color: "#2f363c",
                  }}
                >
                  # of MVP's
                </Text>
                <View
                  style={{
                    width: "25%",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    paddingRight: 30,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "muro",
                      fontWeight: "bold",
                      // fontFamily: "KanedaGothic-BoldItalic",
                      fontSize: 20,
                      color: "#4850CF",
                    }}
                  >
                    {this.state.mvp ? this.state.mvp : 0}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#ebeced",
                  width: "80%",
                  justifyContent: "space-between",
                  height: 50,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontFamily: "KanedaGothic-BoldItalic",
                    fontSize: 20,
                    color: "#2f363c",
                  }}
                >
                  Averages Points
                </Text>
                <View
                  style={{
                    width: "25%",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    paddingRight: 30,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "muro",
                      fontWeight: "bold",
                      // fontFamily: "KanedaGothic-BoldItalic",
                      fontSize: 20,
                      color: "#4850CF",
                    }}
                  >
                    {this.state.average ? this.state.average : 0}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  // backgroundColor: "lightgray",
                  width: "80%",
                  justifyContent: "space-between",
                  height: 50,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontFamily: "KanedaGothic-BoldItalic",
                    fontSize: 20,
                    color: "#2f363c",
                  }}
                >
                  Averages Rebounds
                </Text>
                <View
                  style={{
                    width: "25%",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    paddingRight: 30,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "muro",
                      fontWeight: "bold",
                      // fontFamily: "KanedaGothic-BoldItalic",
                      fontSize: 20,
                      color: "#4850CF",
                    }}
                  >
                    {this.state.rebound ? this.state.rebound : 0}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#ebeced",
                  width: "80%",
                  justifyContent: "space-between",
                  height: 50,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontFamily: "KanedaGothic-BoldItalic",
                    fontSize: 20,
                    color: "#2f363c",
                  }}
                >
                  Averages Assists
                </Text>
                <View
                  style={{
                    width: "25%",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    paddingRight: 30,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "muro",
                      fontWeight: "bold",
                      // fontFamily: "KanedaGothic-BoldItalic",
                      fontSize: 20,
                      color: "#4850CF",
                    }}
                  >
                    {this.state.assist ? this.state.assist : 0}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  // backgroundColor: "lightgray",
                  width: "80%",
                  justifyContent: "space-between",
                  height: 50,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontFamily: "KanedaGothic-BoldItalic",
                    fontSize: 20,
                    color: "#2f363c",
                  }}
                >
                  Averages Turnovers
                </Text>
                <View
                  style={{
                    width: "25%",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    paddingRight: 30,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "muro",
                      fontWeight: "bold",
                      // fontFamily: "KanedaGothic-BoldItalic",
                      fontSize: 20,
                      color: "#4850CF",
                    }}
                  >
                    {this.state.turnover ? this.state.turnover : 0}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#ebeced",
                  width: "80%",
                  justifyContent: "space-between",
                  height: 50,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontFamily: "KanedaGothic-BoldItalic",
                    fontSize: 20,
                    color: "#2f363c",
                  }}
                >
                  Overall Shooting %
                </Text>
                <View
                  style={{
                    width: "25%",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    paddingRight: 15,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "muro",
                      fontWeight: "bold",
                      // fontFamily: "KanedaGothic-BoldItalic",
                      fontSize: 20,
                      color: "#4850CF",
                    }}
                  >
                    {this.state.overallshooting
                      ? this.state.overallshooting
                      : 0}
                    %
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  // backgroundColor: "lightgray",
                  width: "80%",
                  justifyContent: "space-between",
                  height: 50,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontFamily: "KanedaGothic-BoldItalic",
                    fontSize: 20,
                    color: "#2f363c",
                  }}
                >
                  2 Point Shooting %
                </Text>
                <View
                  style={{
                    width: "25%",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    paddingRight: 15,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "muro",
                      fontWeight: "bold",
                      // fontFamily: "KanedaGothic-BoldItalic",
                      fontSize: 20,
                      color: "#4850CF",
                    }}
                  >
                    {this.state.twopointshooting
                      ? this.state.twopointshooting
                      : 0}
                    %
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#ebeced",
                  width: "80%",
                  justifyContent: "space-between",
                  height: 50,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontFamily: "KanedaGothic-BoldItalic",
                    fontSize: 20,
                    color: "#2f363c",
                  }}
                >
                  3 Point Shooting %
                </Text>
                <View
                  style={{
                    width: "25%",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                    paddingRight: 15,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "muro",
                      fontWeight: "bold",
                      // fontFamily: "KanedaGothic-BoldItalic",
                      fontSize: 20,
                      color: "#4850CF",
                    }}
                  >
                    {this.state.threepointshooting
                      ? this.state.threepointshooting
                      : 0}
                    %
                  </Text>
                </View>
              </View>
              {/* <View></View>
              <TouchableOpacity
                onPress={() => this.props.navigation.push("Search")}
                style={{
                  backgroundColor: "#4850CF",
                  height: 50,
                  width: "70%",
                  borderRadius: 10,
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginBottom: 220,
                }}
              >
                <Text style={{ color: "white", fontSize: 20 }}>
                  Back To Home
                </Text>
              </TouchableOpacity> */}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
