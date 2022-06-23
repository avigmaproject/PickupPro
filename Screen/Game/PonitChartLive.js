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
import {
  proposegameend,
  releasplayerdata,
  getcurrentgamedetails,
} from "../../utils/ConfigApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "native-base";
import CustomButton2 from "../../SmartComponent/CustomeButton2";
import { showTabBar1 } from "../../store/action/tabbar/action";
import { connect } from "react-redux";
class PonitChartLive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homescore: null,
      isLoading: false,
      gameid: null,
      token: null,
      name: null,
      imagepath: null,
      id: null,
      visitingscore: null,
    };
  }
  componentDidMount = async () => {
    this.timer = setInterval(() => this.GetCurrentGameDetails(), 8000);
    this.setState(
      {
        gameid: this.props.route.params.gameid,
      },
      () => this.getAccessToken()
    );
  };
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  EndGame = async () => {
    clearInterval(this.timer);
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

        this.props.navigation.navigate("FinalState1", { data: res });
        this.props.showTabBar1(false);

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
  ProposeToEnd = async () => {
    this.setState({ isLoading: true });
    let data = {
      GT_Game_PkeyID: parseInt(this.state.gameid),
      Type: 1,
    };
    console.log("EndGame", data);
    await proposegameend(data, this.state.token)
      .then((res) => {
        console.log("res1234: ", res);
        this.props.navigation.navigate("Search");
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
  GetCurrentGameDetails = async () => {
    // this.setState({ isLoading: true });
    let data = {
      Game_PkeyID: this.state.gameid,
      Type: 1,
    };
    console.log("GetCurrentGameDetailsdata231", data, this.state.token);
    await getcurrentgamedetails(data, this.state.token)
      .then((res) => {
        console.log("GetCurrentGameDetails", res);
        this.setState({
          name: res[0][0].User_Name,
          imagepath: res[0][0].User_Image_Path,
          id: res[0][0].User_PkeyID,
          homescore: res[0][0].GT_Home_TeamScore,
          visitingscore: res[0][0].GT_Visiting_TeamScore,
        });

        // this.props.navigation.navigate("FinalStats", { data: res });
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

  showMessage = (message) => {
    if (message !== "" && message !== null && message !== undefined) {
      Toast.show({
        text: message,
        duration: 900,
        type: "success",
      });
    }
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
          () => this.GetCurrentGameDetails()
        );
      } else {
        console.log("no token found");
      }
    } catch (e) {
      console.log(e);
    }
    console.log("logintoken", token);
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.isLoading} />
        <SafeAreaView>
          <HeaderArrow
            icon="arrowleft"
            navigation={this.props.navigation}
            title="View stats"
          />
          <ScrollView>
            <View style={{ flex: 1, marginBottom: 100 }}>
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
                      uri: this.state.imagepath
                        ? this.state.imagepath
                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/1200px-Unknown_person.jpg",
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 30,
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
                  {this.state.name ? this.state.name : null}
                </Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontStyle: "italic",
                    fontSize: 20,
                    lineHeight: 40,
                  }}
                >
                  Team 1 Score is :{this.state.homescore}
                </Text>
                <Text
                  style={{
                    fontFamily: "muro",
                    fontWeight: "bold",
                    // fontStyle: "italic",
                    fontSize: 20,
                    lineHeight: 40,
                  }}
                >
                  Team 2 Score is :{this.state.visitingscore}
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <CustomButton2
                  title={"Exit Game"}
                  onPress={() => this.EndGame()}
                />
                <CustomButton2
                  title={"Propose to end game"}
                  onPress={() => this.ProposeToEnd()}
                />
              </View>
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
const mapStateToProps = (state, ownProps) => ({
  // token: state.authReducer.token,
  // parentid: state.parentidReducer.parentid,
});

const mapDispatchToProps = {
  showTabBar1,
};
export default connect(mapStateToProps, mapDispatchToProps)(PonitChartLive);
