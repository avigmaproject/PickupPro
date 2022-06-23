import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Alert,
  SafeAreaView,
  FlatList,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import HeaderArrow from "../../SmartComponent/Header/HeaderArrow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { searchmasterdata, getcaptaindata } from "../../utils/ConfigApi";
import Spinner from "react-native-loading-spinner-overlay";
import SearchableDropdown from "react-native-searchable-dropdown";

export default class SearchPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      currentLatitude: null,
      currentLongitude: null,
      token: null,
      serach: null,
      UserData: [],
      output: [],
      backupData: [],
      PlayerData: [],
    };
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentDidMount = async () => {
    await this.getAccessToken();
    await this.getLatLong();
    await this.getSelectedTeam();
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
    }
  };
  getAccessToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem("token");
      // console.log("tokencaptain", token);
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
  // getSearchData = async () => {
  //   console.log(
  //     "hiiiiiii",
  //     this.state.currentLatitude,
  //     this.state.currentLongitude
  //   );
  //   if (this.state.serach) {
  //     this.setState({ isLoading: true });
  //     let data = {
  //       User_Name: this.state.serach,
  //       Pagnumber: 1,
  //       NoOfRows: 100,
  //       Type: 3,
  //       User_latitude: this.state.currentLatitude,
  //       User_longitude: this.state.currentLongitude,
  //     };
  //     console.log("search data", data);
  //     await searchmasterdata(data, this.state.token)
  //       .then((res) => {
  //         console.log("res:searchmasterdata ", res);
  //         this.setState({
  //           UserData: res[0],
  //           isLoading: false,
  //         });
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         if (error.request) {
  //           console.log(error.request);
  //           this.setState({ isLoading: false });
  //         }
  //         if (error.response) {
  //           console.log(error.response);
  //           this.setState({ isLoading: false });
  //         }
  //         console.log("im in catch");
  //         this.setState({ isLoading: false });
  //       });
  //   }
  // };
  getSelectedTeam = async () => {
    this.setState({ isLoading: true });
    let data = {
      Pagnumber: 1,
      NoOfRows: 100,
      Type: 4,
      User_latitude: this.state.currentLatitude,
      User_longitude: this.state.currentLongitude,
    };
    console.log("get captain data", data);
    await getcaptaindata(data, this.state.token)
      .then((res) => {
        console.log("res:selectedteamdata ", res);
        this.setState({
          PlayerData: res[0],
          backupData: res[0],
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
  };
  searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = this.state.PlayerData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        // return console.log(item.User_Name);
        const itemData = item.User_Name
          ? item.User_Name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      console.log(newData);
      // const dataGroup = this.getContact(newData);
      // this.props.setContacts(dataGroup);
      this.setState({
        PlayerData: newData,
      });
    } else {
      // const dataGroup = this.getContact(this.state.data);
      // this.props.setContacts(dataGroup);
      this.setState({
        PlayerData: this.state.backupData,
      });
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
    const { isLoading, PlayerData } = this.state;
    console.log("hiiiiiirender", this.state.UserData);
    return (
      <SafeAreaView>
        <View style={{ backgroundColor: "white", height: "100%" }}>
          <HeaderArrow
            title="Search Players"
            navigation={this.props.navigation}
          />
          <ScrollView>
            <Spinner visible={isLoading} />
            <View style={{ marginHorizontal: "4%" }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
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
                    width: "95%",
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
                    style={{
                      marginLeft: 20,
                      width: "95%",
                      paddingHorizontal: 20,
                    }}
                    // onEndEditing={() => this.getSearchData()}
                    onChangeText={(serach) => {
                      this.setState({ serach });
                      this.searchFilterFunction(serach);
                    }}
                  />
                  {this.state.serach ? (
                    <TouchableOpacity
                      onPress={() =>
                        this.setState(
                          {
                            serach: "",
                            // userData: [],
                            PlayerData: [],
                          },
                          () => this.getSelectedTeam()
                        )
                      }
                    >
                      <Entypo
                        name="cross"
                        size={25}
                        style={{ marginRight: 20, paddingRight: 20 }}
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
              {this.state.UserData ? (
                <View style={{ marginTop: 20, marginLeft: "4%" }}>
                  <Text style={{ color: "gray", fontSize: 20 }}>Result</Text>
                </View>
              ) : null}

              <View>
                <FlatList
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  data={this.state.PlayerData}
                  renderItem={({ item, index }) => {
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
                          onPress={() =>
                            this.props.navigation.navigate("Player", { item })
                          }
                        >
                          <View>
                            <Image
                              style={{
                                height: 140,
                                width: 150,
                                borderRadius: 75,
                                // marginRight: 20,
                                // marginLeft: 20,
                                // backgroundColor: "red",
                                marginTop: 40,
                              }}
                              source={{
                                uri: item.User_Image_Path
                                  ? item.User_Image_Path
                                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/1200px-Unknown_person.jpg",
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                        <View style={{ marginTop: 10 }}>
                          <Text
                            style={{
                              fontSize: 30,
                              fontFamily: "muro",
                              fontWeight: "bold",
                              textTransform: "capitalize",
                              // fontStyle: "italic",
                              color: "#4850CF",
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
              </View>

              {/* <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Player")}
                style={{ flexDirection: "row" }}
              >
                <View
                  style={{
                    backgroundColor: "#DCDCDC",
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
                        // elevation: 20,
                      }}
                      source={{
                        uri:
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy09Zp5FS7ZJq7c1gEW4ky5RFk6xA8Cc6kTbM6bxOrsYvQioQg0OW39hpnINeaBp_s0Rc&usqp=CAU",
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
                      }}
                    >
                      LeBronJames
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
              </TouchableOpacity> */}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
