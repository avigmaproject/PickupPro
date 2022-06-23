import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import HeaderArrow from "../../SmartComponent/Header/HeaderArrow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { serachcourtdata } from "../../utils/ConfigApi";
import Spinner from "react-native-loading-spinner-overlay";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { getLatLong } from "../../SmartComponent/LatLong";
import { courtdata } from "../../utils/ConfigApi";
import SearchableDropdown from "react-native-searchable-dropdown";

export default class SearchCourt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      currentLatitude: null,
      currentLongitude: null,
      token: null,
      serach: null,
      userData: [],
      CourtData: [],
      showdata: false,
      output: [],
      backupData: [],
    };
  }
  componentDidMount = async () => {
    await this.getAccessToken();
    await this.getLatLong();
    await this.getCourtData();
  };
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
  searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = this.state.CourtData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        // return console.log(item.Court_Name);
        const itemData = item.Court_Name
          ? item.Court_Name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      console.log(newData);
      // const dataGroup = this.getContact(newData);
      // this.props.setContacts(dataGroup);
      this.setState({
        CourtData: newData,
      });
    } else {
      // const dataGroup = this.getContact(this.state.data);
      // this.props.setContacts(dataGroup);
      this.setState({
        CourtData: this.state.backupData,
      });
    }
  };
  getCourtData = async () => {
    console.log(
      "getCourtData",
      this.state.currentLatitude,
      this.state.currentLongitude
    );
    this.setState({ isLoading: true });
    let data = {
      Type: 3,
      Court_Latitude: this.state.currentLatitude,
      Court_Longitude: this.state.currentLongitude,
      Pagnumber: 1,
      NoOfRows: 11,
    };
    console.log("get court data", data);
    await courtdata(data, this.state.token)
      .then((res) => {
        console.log("res: ", res[0]);
        this.setState({
          CourtData: res[0],
          backupData: res[0],
          isLoading: false,
        });
        let tmp;
        this.state.CourtData.map((item) => {
          tmp = {
            id: item.Court_PkeyID,
            name: item.Court_Name,
          };
          this.state.output.push(tmp);
          // console.log("itemmmm", item);
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.request) {
          console.log(error.request);
          this.setState({ isLoading: false });
        } else if (error.response) {
          console.log(error.response);
          this.setState({ isLoading: false });
        }
        console.log("im in catch");
        this.setState({ isLoading: false });
      });
  };
  getSearchCourtData = async () => {
    if (this.state.serach) {
      this.setState({ isLoading: true });
      let data = {
        Type: 3,
        Court_Latitude: this.state.currentLatitude,
        Court_Longitude: this.state.currentLongitude,
        Pagnumber: 1,
        NoOfRows: 11,
        Court_Name: this.state.serach,
      };
      console.log("get court data", data);
      await serachcourtdata(data, this.state.token)
        .then((res) => {
          console.log("res: ", res);
          this.setState({
            userData: res[0],
            isLoading: false,
          });
        })
        .catch((error) => {
          console.log(error);
          console.log(error.request);
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
      this.getCourtData();
    }
  };
  selectCourt = async (item) => {
    this.props.navigation.navigate("Screen1", { item });
  };

  getLatLong = async () => {
    const value = await AsyncStorage.multiGet(["latitude", "longitude"]);
    const currentLatitude = JSON.parse(value[0][1]);
    const currentLongitude = JSON.parse(value[1][1]);
    if (value !== null && value !== undefined && value !== "") {
      this.setState({
        currentLatitude: currentLatitude,
        currentLongitude: currentLongitude,
      });
    } else {
      alert("data not found");
    }
  };
  render() {
    const { userData, isLoading, output } = this.state;

    return (
      <SafeAreaView>
        <View style={{ backgroundColor: "white", height: "100%" }}>
          <HeaderArrow
            title="Search courts"
            navigation={this.props.navigation}
          />

          <Spinner visible={isLoading} />
          <View style={{ marginHorizontal: "4%" }}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
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
                  placeholder="Start typing to search "
                  value={this.state.serach}
                  style={{ marginLeft: 20, width: "85%" }}
                  // onEndEditing={() => this.getSearchCourtData()}
                  onChangeText={(serach) => {
                    this.setState({
                      serach,
                    });
                    this.searchFilterFunction(serach);
                  }}
                />
                {this.state.serach ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState(
                        {
                          serach: "",
                          userData: [],
                        },
                        () => this.getCourtData()
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
            </View>
          </View>
          <View
            style={{
              marginHorizontal: "4%",
              //    backgroundColor: "pink"
            }}
          >
            {this.state.userData.length > 0 ? (
              <View style={{ marginTop: 20 }}>
                <Text style={{ color: "gray", fontSize: 20 }}>Result</Text>
              </View>
            ) : (
              <View>
                <FlatList
                  horizontal={true}
                  //  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  data={this.state.CourtData}
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
                            onPress={() => this.selectCourt(item)}
                          >
                            <Image
                              style={{
                                height: 200,
                                width: 200,
                                marginRight: 40,
                                marginLeft: 40,
                                borderRadius: 100,
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
                                fontSize: 30,
                                fontFamily: "muro",
                                fontWeight: "bold",
                                color: "#2f363c",
                              }}
                            >
                              {item.Court_State}
                            </Text>
                            <View
                              style={
                                {
                                  // backgroundColor: "pink",
                                  // flexWrap: "wrap",
                                  // width: "90%",
                                }
                              }
                            >
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontFamily: "muro",
                                  fontWeight: "bold",
                                  color: "lightgray",
                                  // flex: 1,
                                  // flexWrap: "wrap",
                                  // flexShrink: 1,
                                }}
                              >
                                {item.Court_Name}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                  keyExtractor={(item) => item.Court_PkeyID}
                />
              </View>
            )}

            <View
              style={{
                // marginHorizontal: 10,
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                // marginBottom: 50,
                // backgroundColor: "green",
              }}
            >
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.userData}
                renderItem={({ item }) => {
                  // this.renderItem(item,index)

                  // return console.log("item", item);
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("Screen1", { item })
                      }
                      // onPress={() => this.props.navigation.navigate("Player")}
                      style={{ flexDirection: "row" }}
                    >
                      <View
                        style={{
                          backgroundColor: "#F8F8F8",
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
                              borderColor: "gray",
                              borderWidth: 1,
                              // elevation: 20,
                            }}
                            source={{
                              uri: item.Court_ImagePath
                                ? item.Court_ImagePath
                                : "https://www.phoca.cz/images/projects/phoca-gallery-r.png",
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
                              fontFamily: "KanedaGothic-BoldItalic",
                              color: "#2f363c",
                            }}
                          >
                            {item.Court_Name}
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
                          <Text
                            style={{
                              fontSize: 20,
                              fontFamily: "KanedaGothic-BoldItalic",
                              color: "gray",
                            }}
                          >
                            SF/PF
                          </Text>
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
                  );
                }}
                keyExtractor={(item) => item.Court_PkeyID}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
