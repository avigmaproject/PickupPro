import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import HeaderArrow from "../../SmartComponent/Header/HeaderArrow";
import Header from "../../SmartComponent/Header/Header";
import CustomButton from "../../SmartComponent/CustomButton";
import messaging from "@react-native-firebase/messaging";
import { ScrollView } from "react-native-gesture-handler";
import StarRating from "react-native-star-rating";
import { userranting } from "../../utils/ConfigApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default class FinalStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 0,
      starCount1: 0,
      data: [],
      leftteamscore: null,
      rightteamscoe: null,
      token: null,
      gameid: null,
      winingteam: [],
      winingteam1: [],
      thumbs: true,
      thumbs1: true,
      thumbs2: true,
      thumbs3: true,
      disable: false,
      disable1: false,
      disable2: false,
      disable3: false,
      text: null,
      text1: null,

      twopointmiss: null,
      twopointmake: null,
      threepointmake: null,
      threepointmiss: null,
      rebounds: null,
      turnover: null,
      overall: null,
    };
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentDidMount = async () => {
    const { WinningTeam } = this.props.route.params.data[0];
    const { data } = this.props.route.params;
    const { navigation } = this.props;
    console.log("WinningTeam1231", this.props.route.params.data[0]);
    this._unsubscribe = navigation.addListener("focus", () => {
      messaging().onMessage((message) => {
        console.log("onNotificationOpenedAppmessage", message);
        if (message.notification.title === "PickupPro") {
          this.props.navigation.push("Search");
        }
      });

      this.setState({
        leftteamscore: data[0].GT_Home_TeamScore,
        rightteamscoe: data[0].GT_Visiting_TeamScore,
      });
      if (WinningTeam.length > 0) {
        this.setState({
          data: WinningTeam,
          leftteamscore: data[0].GT_Home_TeamScore,
          rightteamscoe: data[0].GT_Visiting_TeamScore,
          winingteam: WinningTeam[0],
          winingteam1: WinningTeam,
          twopointmake: WinningTeam[0].TwoPointPer,
          // twopointmiss: this.props.route.params.data[0].WinningTeam[0]
          //   .ThreePointPer,
          threepointmake: this.props.route.params.data[0].WinningTeam[0]
            .ThreePointPer,
          // threepointmiss: this.props.route.params.data[0].GPT_Point_Miss_Three,
          rebounds: this.props.route.params.data[0].WinningTeam[0].GPT_Rebound,
          turnover: this.props.route.params.data[0].WinningTeam[0].GPT_Turnover,
          overall: this.props.route.params.data[0].WinningTeam[0].Overall,
          // .User_PkeyID,
          // losingteam: this.props.route.params.data[0].LoseingTeam,PT_PkeyID
        });
      }
      this.getGmaeId();
      this.getAccessToken();
    });
  };

  getGmaeId = async () => {
    let gameid;
    try {
      gameid = await AsyncStorage.getItem("gameid");
      // console.log("teamgameid", gameid);
      if (gameid !== null && gameid !== undefined && gameid !== "") {
        this.setState({
          gameid,
        });
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
      // console.log("teamgameid", token);
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
    // console.log("logintoken", token);
  };
  onUserRating = async () => {
    this.setState({ isLoading: true });
    let data = {
      PT_PkeyID: this.state.winingteam.PT_PkeyID,
      PT_Rating: this.state.text,
      PT_ScoreKepper_Rating: this.state.text1,
      Type: 6,
    };
    console.log("UserRating", data);
    await userranting(data, this.state.token)
      .then((res) => {
        console.log("res: UserRating", res);
        this.props.navigation.push("Search");

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
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }
  onStarRatingPress1(rating) {
    this.setState({
      starCount1: rating,
    });
  }

  // onrenderItem = (item) => {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         width: "100%",
  //         flexDirection: "row",
  //         // backgroundColor: "pink",\\\
  //       }}
  //     >
  //       <View
  //         style={{
  //           marginTop: 50,
  //           // backgroundColor: "red",
  //           flexGrow: 1,
  //           justifyContent: "center",
  //           alignItems: "center",
  //           width: "10%",
  //         }}
  //       >
  //         <View
  //           style={{
  //             justifyContent: "center",
  //             alignItems: "center",
  //             // backgroundColor: "green",
  //             width: 400,
  //           }}
  //         >
  //           <Image
  //             style={{
  //               height: 200,
  //               width: 200,
  //               marginRight: 40,
  //               marginLeft: 40,
  //               borderRadius: 125,
  //             }}
  //             source={{
  //               uri: item.User_Image_Path
  //                 ? item.User_Image_Path
  //                 : "https://www.phoca.cz/images/projects/phoca-gallery-r.png",
  //             }}
  //           />
  //           <View
  //             style={{
  //               justifyContent: "center",
  //               alignItems: "center",
  //               marginTop: 20,
  //             }}
  //           >
  //             <Text
  //               style={{
  //                 color: "#4850CF",
  //                 fontSize: 50,
  //                 fontFamily: "muro",
  //               }}
  //             >
  //               Your stats
  //             </Text>
  //           </View>
  //           <View
  //             style={{
  //               marginHorizontal: "10%",
  //               justifyContent: "center",
  //               alignItems: "center",
  //               marginTop: 20,
  //               // backgroundColor: 'red',
  //             }}
  //           >
  //             <View
  //               style={{
  //                 flexDirection: "row",
  //                 justifyContent: "space-between",
  //                 // backgroundColor: 'pink',
  //                 width: 200,
  //               }}
  //             >
  //               <Text
  //                 style={{
  //                   fontSize: 30,
  //                   fontFamily: "KanedaGothic-BoldItalic",
  //                 }}
  //               >
  //                 Pre score
  //               </Text>
  //               <Text
  //                 style={{
  //                   color: "#4850CF",
  //                   fontSize: 40,
  //                   fontFamily: "KanedaGothic-BoldItalic",
  //                 }}
  //               >
  //                 {item.PT_Score_Rating}
  //               </Text>
  //             </View>
  //             <View
  //               style={{
  //                 flexDirection: "row",
  //                 justifyContent: "space-between",
  //                 backgroundColor: "lightgray",
  //                 width: 250,
  //                 height: 50,
  //                 alignItems: "center",
  //               }}
  //             >
  //               <Text
  //                 style={{
  //                   fontSize: 30,
  //                   fontFamily: "KanedaGothic-BoldItalic",
  //                   paddingLeft: "11%",
  //                 }}
  //               >
  //                 Point Scored
  //               </Text>
  //               <Text
  //                 style={{
  //                   color: "#4850CF",
  //                   fontSize: 40,
  //                   marginRight: "11%",
  //                   fontFamily: "KanedaGothic-BoldItalic",
  //                 }}
  //               >
  //                 {item.PT_Score_Final}
  //               </Text>
  //             </View>
  //             <View
  //               style={{
  //                 flexDirection: "row",
  //                 justifyContent: "space-between",
  //                 // backgroundColor: "pink",
  //                 width: 200,
  //               }}
  //             >
  //               <Text
  //                 style={{
  //                   fontSize: 30,
  //                   fontFamily: "KanedaGothic-BoldItalic",
  //                 }}
  //               >
  //                 Assists
  //               </Text>
  //               <Text
  //                 style={{
  //                   color: "#4850CF",
  //                   fontSize: 40,
  //                   fontFamily: "KanedaGothic-BoldItalic",
  //                 }}
  //               >
  //                 {item.PT_Score_Assit}
  //               </Text>
  //             </View>
  //           </View>

  //           <View style={{ marginTop: 10 }}>
  //             <Text>How well did we rank your game?</Text>
  //           </View>
  //           <View style={{ marginTop: 10 }}>
  //             <StarRating
  //               disabled={false}
  //               maxStars={5}
  //               rating={this.state.starCount}
  //               emptyStarColor={"#4850CF"}
  //               starSize={30}
  //               fullStarColor={"#4850CF"}
  //               selectedStar={(rating) => this.onStarRatingPress(rating)}
  //             />
  //           </View>
  //           <View style={{ marginTop: 10 }}>
  //             <Text>How well did we rank your game?</Text>
  //           </View>
  //           <View style={{ marginTop: 10, marginBottom: 30 }}>
  //             <StarRating
  //               disabled={false}
  //               maxStars={5}
  //               rating={this.state.starCount1}
  //               starSize={30}
  //               emptyStarColor={"#4850CF"}
  //               fullStarColor={"#4850CF"}
  //               selectedStar={(rating) => this.onStarRatingPress1(rating)}
  //             />
  //           </View>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // <View
  //   style={{
  //     backgroundColor: "pink",
  //     // marginHorizontal: 10,
  //     marginVertical: 10,
  //   }}
  // >
  //   <View
  //     style={{
  //       justifyContent: "center",
  //       alignItems: "center",
  //       // backgroundColor: "red",
  //     }}
  //   >
  //     <View style={{ marginTop: 20 }}>
  //       <Image
  //         style={{
  //           height: 100,
  //           width: 100,
  //           borderRadius: 50,
  //           marginRight: 20,
  //           marginLeft: 20,
  //         }}
  //         source={{
  //           uri: item.User_Image_Path
  //             ? item.User_Image_Path
  //             : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/1200px-Unknown_person.jpg",
  //         }}
  //       />
  //     </View>
  //   </View>
  //   <View
  //     style={{
  //       justifyContent: "center",
  //       alignItems: "center",
  //       marginTop: 20,
  //     }}
  //   >
  //     <Text
  //       style={{
  //         color: "#4850CF",
  //         fontSize: 50,
  //         fontFamily: "KanedaGothic-BoldItalic",
  //       }}
  //     >
  //       Your stats
  //     </Text>
  //   </View>
  //   <View
  //     style={{
  //       marginHorizontal: "10%",
  //       justifyContent: "center",
  //       alignItems: "center",
  //       marginTop: 20,
  //       // backgroundColor: 'red',
  //     }}
  //   >
  //     <View
  //       style={{
  //         flexDirection: "row",
  //         justifyContent: "space-between",
  //         // backgroundColor: 'pink',
  //         width: 150,
  //       }}
  //     >
  //       <Text
  //         style={{
  //           fontSize: 30,
  //           fontFamily: "KanedaGothic-BoldItalic",
  //         }}
  //       >
  //         Pre score
  //       </Text>
  //       <Text
  //         style={{
  //           color: "#4850CF",
  //           fontSize: 40,
  //           fontFamily: "KanedaGothic-BoldItalic",
  //         }}
  //       >
  //         9.5
  //       </Text>
  //     </View>
  //     <View
  //       style={{
  //         flexDirection: "row",
  //         justifyContent: "space-between",
  //         backgroundColor: "lightgray",
  //         width: 150,
  //         height: 50,
  //         alignItems: "center",
  //       }}
  //     >
  //       <Text
  //         style={{
  //           fontSize: 30,
  //           fontFamily: "KanedaGothic-BoldItalic",
  //           marginLeft: "11%",
  //         }}
  //       >
  //         Point Scored
  //       </Text>
  //       <Text
  //         style={{
  //           color: "#4850CF",
  //           fontSize: 40,
  //           marginRight: "11%",
  //           fontFamily: "KanedaGothic-BoldItalic",
  //         }}
  //       >
  //         8
  //       </Text>
  //     </View>
  //     <View
  //       style={{
  //         flexDirection: "row",
  //         justifyContent: "space-between",
  //         // backgroundColor: 'pink',
  //         width: 150,
  //       }}
  //     >
  //       <Text
  //         style={{
  //           fontSize: 30,
  //           fontFamily: "KanedaGothic-BoldItalic",
  //         }}
  //       >
  //         Assists
  //       </Text>
  //       <Text
  //         style={{
  //           color: "#4850CF",
  //           fontSize: 40,
  //           fontFamily: "KanedaGothic-BoldItalic",
  //         }}
  //       >
  //         1
  //       </Text>
  //     </View>
  //     <View style={{ marginTop: 10 }}>
  //       <Text>How well did we rank your game?</Text>
  //     </View>
  //     <View style={{ marginTop: 10 }}>
  //       <StarRating
  //         disabled={false}
  //         maxStars={5}
  //         rating={this.state.starCount}
  //         emptyStarColor={"#4850CF"}
  //         starSize={30}
  //         fullStarColor={"#4850CF"}
  //         selectedStar={(rating) => this.onStarRatingPress(rating)}
  //       />
  //     </View>
  //     <View style={{ marginTop: 10 }}>
  //       <Text>How well did we rank your game?</Text>
  //     </View>
  //     <View style={{ marginTop: 10, marginBottom: 30 }}>
  //       <StarRating
  //         disabled={false}
  //         maxStars={5}
  //         rating={this.state.starCount1}
  //         starSize={30}
  //         emptyStarColor={"#4850CF"}
  //         fullStarColor={"#4850CF"}
  //         selectedStar={(rating) => this.onStarRatingPress1(rating)}
  //       />
  //     </View>
  //   </View>
  // </View>
  // };

  render() {
    return (
      <SafeAreaView>
        <View>
          {/* <Header title="Final stats" /> */}
          <HeaderArrow title="Final stats" navigation={this.props.navigation} />

          <ScrollView>
            <View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                    // backgroundColor: "pink",
                    width: "50%",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: "muro",
                        fontWeight: "bold",
                        fontSize: 50,
                        color: "#CA5328",
                      }}
                    >
                      {this.state.leftteamscore ? this.state.leftteamscore : 0}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: "muro",
                        fontWeight: "bold",
                        fontSize: 50,
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
                        fontSize: 50,
                        color: "#CA5328",
                      }}
                    >
                      {this.state.rightteamscoe ? this.state.rightteamscoe : 0}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItem: "center",
                  // backgroundColor: "red",
                }}
              >
                {this.state.leftteamscore === this.state.rightteamscoe ? (
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Match Draw
                  </Text>
                ) : this.state.leftteamscore > this.state.rightteamscoe ? (
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Team 1 wins!
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Team 2 wins!
                  </Text>
                )}
              </View>
              {this.state.winingteam1.length > 0 ? (
                <View>
                  <View
                    style={{
                      flex: 1,
                      width: "100%",
                      flexDirection: "row",
                      // backgroundColor: "pink",
                    }}
                  >
                    <View
                      style={{
                        marginTop: 50,
                        // backgroundColor: "red",
                        flexGrow: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        width: "10%",
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          // backgroundColor: "green",
                          width: 400,
                        }}
                      >
                        <Image
                          style={{
                            height: 200,
                            width: 200,
                            marginRight: 40,
                            marginLeft: 40,
                            borderRadius: 125,
                          }}
                          source={{
                            uri: this.state.winingteam
                              ? this.state.winingteam.User_Image_Path
                              : "https://www.phoca.cz/images/projects/phoca-gallery-r.png",
                          }}
                        />
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 20,
                          }}
                        >
                          <Text
                            style={{
                              color: "#4850CF",
                              fontSize: 30,
                              fontFamily: "muro",
                              fontWeight: "bold",
                            }}
                          >
                            Your stats
                          </Text>
                        </View>
                        <View
                          style={{
                            marginHorizontal: "10%",
                            justifyContent: "center",
                            alignItems: "center",
                            // marginTop: 20,
                            // backgroundColor: "red",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              // backgroundColor: "pink",
                              alignItems: "center",
                              width: 350,
                              height: 50,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                paddingLeft: "4%",
                              }}
                            >
                              Pro score
                            </Text>
                            <Text
                              style={{
                                color: "#4850CF",
                                fontSize: 20,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                paddingRight: "4%",
                              }}
                            >
                              {this.state.winingteam
                                ? this.state.winingteam.PT_Score_Final
                                : 0}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              backgroundColor: "lightgray",
                              width: 350,
                              height: 50,
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                paddingLeft: "4%",
                              }}
                            >
                              Point Scored
                            </Text>
                            <Text
                              style={{
                                color: "#4850CF",
                                fontSize: 20,
                                marginRight: "4%",
                                fontFamily: "muro",
                                fontWeight: "bold",
                              }}
                            >
                              {this.state.winingteam
                                ? this.state.winingteam.PT_Score_Rating
                                : 0}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              // backgroundColor: "pink",
                              alignItems: "center",
                              height: 50,
                              width: 350,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                paddingLeft: "4%",
                              }}
                            >
                              Assists
                            </Text>
                            <Text
                              style={{
                                color: "#4850CF",
                                fontSize: 20,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                paddingRight: "4%",
                              }}
                            >
                              {this.state.winingteam
                                ? this.state.winingteam.PT_Score_Assit
                                : 0}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              backgroundColor: "lightgray",
                              width: 350,
                              height: 50,
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                paddingLeft: "4%",
                              }}
                            >
                              Rebounds
                            </Text>
                            <Text
                              style={{
                                color: "#4850CF",
                                fontSize: 20,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                marginRight: "4%",
                              }}
                            >
                              {this.state.rebounds ? this.state.rebounds : 0}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              width: 350,
                              height: 50,
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                paddingLeft: "4%",
                              }}
                            >
                              Turnovever
                            </Text>
                            <Text
                              style={{
                                color: "#4850CF",
                                fontSize: 20,
                                marginRight: "4%",
                                fontFamily: "muro",
                                fontWeight: "bold",
                              }}
                            >
                              {
                                this.state.turnover
                                // ? this.state.turnover : 0
                              }
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              backgroundColor: "lightgray",
                              width: 350,
                              height: 50,
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                paddingLeft: "6%",
                              }}
                            >
                              Shooting %
                            </Text>
                            <Text
                              style={{
                                color: "#4850CF",
                                fontSize: 20,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                marginRight: "4%",
                              }}
                            >
                              {
                                this.state.overall
                                //  ? this.state.overall : 10
                              }
                              %
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              // backgroundColor: "lightgray",
                              width: 350,
                              height: 50,
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                paddingLeft: "6%",
                              }}
                            >
                              2 Point Shoooting %
                            </Text>
                            <Text
                              style={{
                                color: "#4850CF",
                                fontSize: 20,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                marginRight: "4%",
                              }}
                            >
                              {
                                this.state.twopointmake
                                // ? this.state.twopointmake
                                // : 0
                              }
                              %
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              backgroundColor: "lightgray",
                              width: 350,
                              height: 50,
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                paddingLeft: "6%",
                              }}
                            >
                              3 Point Shooting %
                            </Text>
                            <Text
                              style={{
                                color: "#4850CF",
                                fontSize: 20,
                                marginRight: "4%",
                                fontFamily: "muro",
                                fontWeight: "bold",
                              }}
                            >
                              {
                                this.state.threepointmake
                                // ? this.state.threepointmake
                                // : 0
                              }
                              %
                            </Text>
                          </View>
                        </View>

                        <View style={{ marginTop: 30 }}>
                          <Text> Is the Pro Score accurate?</Text>
                        </View>
                        <View
                          style={{
                            marginTop: 10,
                            flexDirection: "row",
                            width: "50%",
                            // backgroundColor: "red",
                            justifyContent: "space-around",
                          }}
                        >
                          <TouchableOpacity
                            disabled={this.state.disable}
                            onPress={() =>
                              this.setState({
                                thumbs: !this.state.thumbs,
                                disable1: !this.state.disable1,
                                text: 1,
                              })
                            }
                          >
                            {this.state.thumbs ? (
                              <FontAwesome
                                name="thumbs-o-up"
                                size={40}
                                style={{
                                  color: "black",
                                  textAlign: "left",
                                }}
                              />
                            ) : (
                              <FontAwesome
                                name="thumbs-up"
                                size={40}
                                style={{
                                  color: "black",
                                  textAlign: "left",
                                }}
                              />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            disabled={this.state.disable1}
                            onPress={() =>
                              this.setState({
                                thumbs1: !this.state.thumbs1,
                                disable: !this.state.disable,
                                text: 0,
                              })
                            }
                          >
                            {this.state.thumbs1 ? (
                              <FontAwesome
                                name="thumbs-o-down"
                                size={40}
                                style={{
                                  color: "black",
                                  textAlign: "left",
                                }}
                              />
                            ) : (
                              <FontAwesome
                                name="thumbs-down"
                                size={40}
                                style={{
                                  color: "black",
                                  textAlign: "left",
                                }}
                              />
                            )}
                          </TouchableOpacity>
                          {/* <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={this.state.starCount}
                            emptyStarColor={"#4850CF"}
                            starSize={30}
                            fullStarColor={"#4850CF"}
                            selectedStar={(rating) =>
                              this.onStarRatingPress(rating)
                            }
                          /> */}
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <Text>Are your stats accurate?</Text>
                        </View>
                        <View
                          style={{
                            marginTop: 10,
                            marginBottom: 30,
                            flexDirection: "row",
                            width: "50%",
                            // backgroundColor: "red",
                            justifyContent: "space-around",
                          }}
                        >
                          <TouchableOpacity
                            disabled={this.state.disable2}
                            onPress={() =>
                              this.setState({
                                thumbs2: !this.state.thumbs2,
                                disable3: !this.state.disable3,
                                text1: 1,
                              })
                            }
                          >
                            {this.state.thumbs2 ? (
                              <FontAwesome
                                name="thumbs-o-up"
                                size={40}
                                style={{
                                  color: "black",
                                  textAlign: "left",
                                }}
                              />
                            ) : (
                              <FontAwesome
                                name="thumbs-up"
                                size={40}
                                style={{
                                  color: "black",
                                  textAlign: "left",
                                }}
                              />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            disabled={this.state.disable3}
                            onPress={() =>
                              this.setState({
                                thumbs3: !this.state.thumbs3,
                                disable2: !this.state.disable2,
                                text1: 0,
                              })
                            }
                          >
                            {this.state.thumbs3 ? (
                              <FontAwesome
                                name="thumbs-o-down"
                                size={40}
                                style={{
                                  color: "black",
                                  textAlign: "left",
                                }}
                              />
                            ) : (
                              <FontAwesome
                                name="thumbs-down"
                                size={40}
                                style={{
                                  color: "black",
                                  textAlign: "left",
                                }}
                              />
                            )}
                          </TouchableOpacity>
                          {/* <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={this.state.starCount1}
                            starSize={30}
                            emptyStarColor={"#4850CF"}
                            fullStarColor={"#4850CF"}
                            selectedStar={(rating) =>
                              this.onStarRatingPress1(rating)
                            }
                          /> */}
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      marginBottom: 200,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CustomButton
                      title={"Submit"}
                      onPress={() => this.onUserRating()}
                      // onPress={() =>
                      //   this.props.navigation.navigate("TeamRight", {
                      //     gameId: this.state.gameid,
                      //   })
                      // }
                    />
                    {/* <TouchableOpacity
                      onPress={() => this.onUserRating()}
                      style={{
                        activeOpacity: 1,
                        height: 50,
                        width: "60%",
                        borderRadius: 10,
                        marginTop: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        borderColor: "#4850CF",
                        borderWidth: 1,
                        marginBottom: 90,
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
                        Submit
                      </Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
              ) : (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontFamily: "muro",
                      fontWeight: "bold",
                      fontSize: 30,
                      marginTop: 20,
                    }}
                  >
                    Data not available with respective Player
                  </Text>
                </View>
              )}

              {/* <View style={{ marginBottom: 120 }}>
                <FlatList
                  horizontal={true}
                  // showsHorizontalScrollIndicator={false}
                  data={this.state.winingteam}
                  renderItem={({ item }) => {
                    return this.onrenderItem(item);
                    // return console.log("winingteam", item);
                  }}
                  keyExtractor={(item) => item.User_PkeyID}
                />
              </View> */}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
