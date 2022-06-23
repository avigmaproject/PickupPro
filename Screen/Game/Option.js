import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Modal,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
// import HeaderArrow from "../../SmartComponent/Header/HeaderArrow";
import Header from "../../SmartComponent/Header/Header";

import SegmentedControlTab from "react-native-segmented-control-tab";
import AntDesign from "react-native-vector-icons/AntDesign";
import { postgamedata } from "../../utils/ConfigApi";
import CustomButton2 from "../../SmartComponent/CustomeButton2";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { height } = Dimensions.get("window");
const modalMargin = height / 3.5;

export default class Option extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      selectedIndex1: 0,
      selectedIndex2: 0,
      selectedIndex3: 0,
      selectedIndex4: 0,
      isVisible: false,
      isTimeVisible: false,
      score: 7,
      time: 5,
      scoring: 1,
      winbytwo: 1,
      gameoverflag: 1,
    };
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentDidMount() {
    // this.backhandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.handleBackButtonClick
    // );
    this.getGmaeId();
    this.getAccessToken();
  }

  // componentWillUnmount() {
  //   console.log("backkkkkoption");
  //   this.backhandler.remove();
  // }
  // handleBackButtonClick() {
  //   this.props.navigation.goBack(null);
  //   return true;
  // }
  handleIndexChange = (index) => {
    if (index === 0) {
      this.setState({
        ...this.state,
        selectedIndex: index,
        gameoverflag: 1,
      });
    } else {
      this.setState({
        ...this.state,
        gameoverflag: 2,
        selectedIndex: index,
      });
    }
  };
  handleIndexChange1 = (index) => {
    if (index === 0) {
      this.setState({
        ...this.state,
        time: 5,
        score: 0,
        selectedIndex1: index,
      });
    } else if (index === 1) {
      this.setState({
        ...this.state,
        time: 10,
        score: 0,
        selectedIndex1: index,
      });
    } else if (index === 2) {
      this.setState({
        ...this.state,
        time: 15,
        score: 0,
        selectedIndex1: index,
      });
    } else if (index === 3) {
      this.setState({
        ...this.state,
        isTimeVisible: true,
        score: 0,
        selectedIndex1: index,
      });
    }
  };
  handleIndexChange2 = (index) => {
    if (index === 0) {
      this.setState({
        ...this.state,
        scoring: 1,
        selectedIndex2: index,
      });
    } else if (index === 1) {
      this.setState({
        ...this.state,
        scoring: 2,
        selectedIndex2: index,
      });
    } else if (index === 2) {
      this.setState({
        ...this.state,
        scoring: 3,
        selectedIndex2: index,
      });
    } else if (index === 3) {
      this.setState({
        ...this.state,
        scoring: 4,
        selectedIndex2: index,
      });
    }
  };

  handleIndexChange3 = (index) => {
    if (index === 0) {
      alert("The game end once the score or time limit is reached.");
      this.setState({
        ...this.state,
        winbytwo: 1,
        selectedIndex3: index,
      });
    } else if (index === 1) {
      alert(
        "The score or time limit is reached and the winning team is up by at least two points"
      );
      this.setState({
        ...this.state,
        winbytwo: 2,
        selectedIndex3: index,
      });
    }
  };
  handleIndexChange4 = (index) => {
    if (index === 0) {
      this.setState({
        ...this.state,
        score: 7,
        time: 0,
        selectedIndex4: index,
      });
    } else if (index === 1) {
      this.setState({
        ...this.state,
        score: 11,
        time: 0,
        selectedIndex4: index,
      });
    } else if (index === 2) {
      this.setState({
        ...this.state,
        time: 0,
        score: 15,

        selectedIndex4: index,
      });
    } else if (index === 3) {
      this.setState({
        ...this.state,
        time: 0,
        selectedIndex4: index,
        isVisible: true,
      });
    }
  };
  onScoreChange = (score) => {
    this.setState({ score });
  };
  onTimeChange = (time) => {
    this.setState({ time });
  };
  setModalVisible = (visible) => {
    this.setState({ isVisible: visible });
  };
  setModalTimeVisible = (visible) => {
    this.setState({ isTimeVisible: visible });
  };

  getAccessToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem("token");
      if (token !== null && token !== undefined && token !== "") {
        this.setState(
          {
            token,
          },
          () => this.getLatLong()
        );
      } else {
        console.log("no token found");
      }
    } catch (e) {
      console.log(e);
    }
  };
  getGmaeId = async () => {
    let gameid;
    try {
      gameid = await AsyncStorage.getItem("gameid");
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
  getLatLong = async () => {
    const value = await AsyncStorage.multiGet(["latitude", "longitude"]);
    const currentLatitude = JSON.parse(value[0][1]);
    const currentLongitude = JSON.parse(value[1][1]);
    if (value !== null && value !== undefined && value !== "") {
      this.setState(
        {
          currentLatitude: currentLatitude,
          currentLongitude: currentLongitude,
        }
        // () =>
        //   console.log(
        //     "asyncstorage",
        //     this.state.currentLatitude,
        //     this.state.currentLongitude
        //   )
      );
    }
  };
  PostGametData = async () => {
    this.setState({ isLoading: true });
    let data = {
      Type: 5,
      Game_PkeyID: this.state.gameid,
      Game_Time: this.state.time,
      Game_Score_pattern: this.state.scoring,
      Game_win_pattern: this.state.winbytwo,
      Game_Over: this.state.score,
      Game_Score_Flag: this.state.gameoverflag,
    };
    console.log("datagame", data);
    await postgamedata(data, this.state.token)
      .then((res) => {
        console.log("res", res);
        this.props.navigation.navigate("LiveGame");
        //   this.props.navigation.goBack();
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
          <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
            <Text style={{}}>Enter Score</Text>
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <View
              style={{ borderColor: "gray", borderWidth: 1, borderRadius: 20 }}
            >
              <TextInput
                placeholder="Enter Score"
                placeholderTextColor="gray"
                value={this.state.score}
                onChangeText={this.onScoreChange}
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
                onPress={() => this.setModalVisible(false)}
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
                  Enter Score
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  renderTimeModal = () => {
    return (
      <Modal
        animationType={"fade"}
        style={{ justifyContent: "center", alignItems: "center" }}
        transparent={true}
        visible={this.state.isTimeVisible}
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
          <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
            <Text style={{}}>Enter Time</Text>
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <View
              style={{ borderColor: "gray", borderWidth: 1, borderRadius: 20 }}
            >
              <TextInput
                placeholder="Enter Time"
                placeholderTextColor="gray"
                value={this.state.time}
                onChangeText={this.onTimeChange}
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
                onPress={() => this.setModalTimeVisible(false)}
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
                  Enter Time
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  render() {
    console.log(this.state.time);
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <SafeAreaView>
          {/* <HeaderArrow */}
          <Header
            title="Select your options"
            // navigation={this.props.navigation}
          />
          <ScrollView>
            <View style={styles.viewStyle}>
              <Text style={styles.text}>Game is over when</Text>
            </View>
            <View style={styles.viewStyle2}>
              <View style={{ width: "90%" }}>
                <SegmentedControlTab
                  values={["Score is reached", "Time runs out"]}
                  borderRadius={0}
                  activeTabStyle={styles.activeTabStyle}
                  tabStyle={styles.tabStyle}
                  tabsContainerStyle={styles.tabsContainerStyle}
                  tabTextStyle={styles.tabTextStyle}
                  selectedIndex={this.state.selectedIndex}
                  onTabPress={this.handleIndexChange}
                />
              </View>
            </View>
            {this.state.selectedIndex === 0 ? (
              <View>
                <View style={styles.viewStyle}>
                  <Text style={styles.text}>Score limit</Text>
                </View>
                <View style={styles.viewStyle2}>
                  <View style={{ width: "90%" }}>
                    <SegmentedControlTab
                      values={["7", "11", "15", "Custom"]}
                      borderRadius={0}
                      activeTabStyle={styles.activeTabStyle}
                      tabStyle={styles.tabStyle}
                      tabsContainerStyle={styles.tabsContainerStyle}
                      tabTextStyle={styles.tabTextStyle}
                      selectedIndex={this.state.selectedIndex4}
                      onTabPress={this.handleIndexChange4}
                    />
                  </View>
                </View>
              </View>
            ) : null}
            {this.state.selectedIndex === 1 ? (
              <View>
                <View style={styles.viewStyle}>
                  <Text style={styles.text}>Time limit</Text>
                </View>
                {/* {this.onClick()} */}
                <View style={styles.viewStyle2}>
                  <View style={{ width: "90%" }}>
                    <SegmentedControlTab
                      values={["5 mins.", "10 mins.", "15 mins.", "Custom"]}
                      borderRadius={0}
                      activeTabStyle={styles.activeTabStyle}
                      tabStyle={styles.tabStyle}
                      tabsContainerStyle={styles.tabsContainerStyle}
                      tabTextStyle={styles.tabTextStyle}
                      selectedIndex={this.state.selectedIndex1}
                      onTabPress={this.handleIndexChange1}
                    />
                  </View>
                </View>
              </View>
            ) : null}
            <View style={styles.viewStyle}>
              <Text style={styles.text}>Scoring</Text>
            </View>
            {/* {this.onClick()} */}
            <View style={styles.viewStyle2}>
              <View style={{ width: "90%" }}>
                <SegmentedControlTab
                  values={["1’s & 2’s", "2’s & 3’s", "All 1’s", "All 2’s"]}
                  borderRadius={0}
                  activeTabStyle={styles.activeTabStyle}
                  tabStyle={styles.tabStyle}
                  tabsContainerStyle={styles.tabsContainerStyle}
                  tabTextStyle={styles.tabTextStyle}
                  selectedIndex={this.state.selectedIndex2}
                  onTabPress={this.handleIndexChange2}
                />
              </View>
            </View>

            <View style={styles.viewStyle}>
              <Text style={styles.text}>Win by two ?</Text>
            </View>
            {/* {this.onClick()} */}
            <View style={styles.viewStyle2}>
              <View style={{ width: "90%" }}>
                <SegmentedControlTab
                  values={["Straight up", "Win by two"]}
                  borderRadius={0}
                  activeTabStyle={styles.activeTabStyle}
                  tabStyle={styles.tabStyle}
                  tabsContainerStyle={styles.tabsContainerStyle}
                  tabTextStyle={styles.tabTextStyle}
                  selectedIndex={this.state.selectedIndex3}
                  onTabPress={this.handleIndexChange3}
                />
              </View>
            </View>
            <View style={{ ...styles.viewStyle2, marginBottom: 100 }}>
              <CustomButton2
                title={"START GAME"}
                onPress={() => this.PostGametData()}
              />
              {/* <TouchableOpacity
              onPress={() => this.PostGametData()}
              // onPress={() => this.props.navigation.navigate("LiveGame")}
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
                style={{
                  color: "white",
                  fontSize: 15,
                  marginRight: "3%",
                  fontWeight: "bold",
                }}
              >
                START GAME
              </Text>
              <AntDesign
                name="caretright"
                size={15}
                // style={{ marginRight: 20 }}
                color="white"
              />
            </TouchableOpacity> */}
            </View>
            {this.renderModal()}
            {this.renderTimeModal()}
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
  activeTabStyle: { backgroundColor: "#4850CF" },
  text: { color: "#484848", fontSize: 15 },
  tabsContainerStyle: { height: 45, borderColor: "#4850CF" },
  tabTextStyle: { color: "gray" },
  tabStyle: { borderColor: "#4850CF", borderWidth: 2 },
  viewStyle2: { alignItems: "center", marginTop: 13 },
});
