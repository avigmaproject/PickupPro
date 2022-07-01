import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  BackHandler,
  Alert,
  SafeAreaView,
} from "react-native";
import HeaderArrow from "../../SmartComponent/Header/HeaderArrow";
import CustomButton from "../../SmartComponent/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { courtdata, postcourtdata } from "../../utils/ConfigApi";
import Spinner from "react-native-loading-spinner-overlay";
import { showTabBar1 } from "../../store/action/tabbar/action";
import { connect } from "react-redux";

const colors = ["#4850CF", "#CA5328"];
class NewGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: null,
      currentLatitude: null,
      currentLongitude: null,
      isLoading: false,
      gameId: null,
      token: null,
      UserData: [],
      CourtData: [],
      // data: [
      //   {
      //     img: "https://reactnative.dev/img/tiny_logo.png",
      //     id: 1,
      //     location: "Lebowski Court1",
      //     type: "Outdoor",
      //   },
      //   {
      //     img: "https://reactnative.dev/img/tiny_logo.png",
      //     id: 2,
      //     location: "Lebowski Court2",
      //     type: "Outdoor",
      //   },
      //   {
      //     img: "https://reactnative.dev/img/tiny_logo.png",
      //     id: 3,
      //     location: "Lebowski Court3",
      //     type: "Outdoor",
      //   },
      // ],
    };
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentDidMount() {
    this.getLatLong();
    this.getAccessToken();
    this.getGameId();
    // this.backhandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.handleBackButtonClick
    // );
  }

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
  getAccessToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem("token");
      console.log("tokennewgame", token);
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
      Court_Latitude: this.state.currentLatitude, //19.039, //
      Court_Longitude: this.state.currentLongitude, // 72.8619, //
      Pagnumber: 1,
      NoOfRows: 11,
    };
    console.log("get court data", data);
    await courtdata(data, this.state.token)
      .then((res) => {
        console.log("res: ", res[0]);
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
  PostCourtData = async () => {
    let data;
    if (this.state.gameId) {
      data = {
        Type: 2,
        Game_PkeyID: this.state.gameId,
        Game_Court_PkeyID: this.state.activeIndex,
      };
    } else {
      data = {
        Type: 1,
        Game_Court_PkeyID: this.state.activeIndex,
      };
    }
    console.log(this.state.activeIndex);
    this.setState({ isLoading: true });
    console.log("data", data);
    this.setState({ isLoading: false });
    await postcourtdata(data, this.state.token)
      .then((res) => {
        console.log("res: ", res[0]);
        const gameid = res[0];
        if (res[0]) {
          this.props.showTabBar1(true);
          this.setState({
            gameId: gameid,
            isLoading: false,
          });
          AsyncStorage.setItem("gameid", gameid.toString());
        }
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

  selectCourt = async (id, item) => {
    this.setState(
      {
        activeIndex: id,
        CourtData: item,
      },
      () => this.PostCourtData()
    );
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
        () => this.getCourtData()
      );
    } else {
      console.log("data not found");
    }
  };
  render() {
    const { isLoading } = this.state;
    // console.log("UserData", this.state.UserData);
    return (
      <SafeAreaView>
        <View>
          <HeaderArrow title="Location" navigation={this.props.navigation} />
          <Spinner visible={isLoading} />
          <ScrollView>
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text
                style={{
                  fontSize: 50,
                  color: "#CA5328",
                  fontFamily: "KanedaGothic-BoldItalic",
                }}
              >
                {" "}
                In your area{" "}
              </Text>
            </View>
             {this.state.UserData.length === 0 &&  <View
                      style={{width:"100%",height:200,justifyContent:"center",alignItems:"center"  }}
                    >
                      <Text
                        style={{
                          fontFamily: "KanedaGothic-BoldItalic",
                          fontSize: 40,
                          color: "#2f363c",
                        }}
                      >
                        No Court Found
                        
                      </Text>
                        <Text
                        style={{
                          fontFamily: "KanedaGothic-BoldItalic",
                          fontSize: 20,
                          color: "#2f363c",
                        }}
                      >
                      Only court display near 1km of current location.
                        
                      </Text>
                    </View>}
            <View style={{ marginHorizontal: 10 }}>
              <FlatList
                horizontal={true}
                //  showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={this.state.UserData}
                renderItem={({ item, index }) => {
                  return (
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
                          // paddingHorizontal: "2.2%",
                          flexGrow: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          // marginHorizontal: 40,
                          width: "10%",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            // backgroundColor: "green",
                            // width: "1%",
                          }}
                          onPress={() =>
                            this.selectCourt(item.Court_PkeyID, item)
                          }
                        >
                          <Image
                            style={{
                              height: 250,
                              width: 250,
                              marginRight: 40,
                              marginLeft: 40,
                              borderRadius: 125,
                              // width: "150%",
                              borderColor:
                                this.state.activeIndex === item.Court_PkeyID
                                  ? colors[index % colors.length]
                                  : "white",
                              borderWidth: 5,
                            }}
                            source={{
                              uri: item.Court_ImagePath
                                ? item.Court_ImagePath
                                : "https://www.phoca.cz/images/projects/phoca-gallery-r.png",
                            }}
                          />
                        </TouchableOpacity>
                        <View
                          style={{
                            alignItems: "center",
                            marginTop: 20,
                            // backgroundColor:'red'
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "KanedaGothic-BoldItalic",
                              fontSize: 40,
                              color: "#2f363c",
                            }}
                          >
                            {item.Court_State}
                          </Text>
                          <Text
                            style={{
                              fontFamily: "KanedaGothic-BoldItalic",
                              fontSize: 30,
                              color: "lightgray",
                            }}
                          >
                            {item.Court_Name}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(item) => item.Court_PkeyID}
              />

              <View
                style={{
                  alignItems: "center",
                  marginTop: 40,
                  marginBottom: 150,
                }}
              >
                {this.state.gameId && this.state.UserData.length >0 ? (
                  <CustomButton
                    title={"SELECT"}
                    onPress={() =>
                      this.props.navigation.navigate("SelectCaptain", {
                        gameId: this.state.gameId,
                        CourtData: this.state.CourtData,
                      })
                    }
                  />
                ) : (
                        null
                  // <CustomButton
                  //   title={"SELECT"}
                  //   onPress={() => alert("Please select location")}
                  // />
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
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
export default connect(mapStateToProps, mapDispatchToProps)(NewGame);
