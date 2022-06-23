import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import HeaderArrow from "../../SmartComponent/Header/HeaderArrow";
import SearchableDropdown from "react-native-searchable-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getcaptaindata, searchmasterdata } from "../../utils/ConfigApi";
import Spinner from "react-native-loading-spinner-overlay";
export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      token: null,
      currentLatitude: null,
      currentLongitude: null,
      serach: null,
      isLoading: false,
    };
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    this.getLatLong();
    this.getAccessToken();
    console.log(this.props.route.params);
    this.setState({
      userData: this.props.route.params.item,
    });
    // BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.handleBackButtonClick
    // );
  }

  // componentWillUnmount() {
  //   console.log("navigation", this.props.navigation);
  //   BackHandler.removeEventListener(
  //     "hardwareBackPress",
  //     this.handleBackButtonClick
  //   );
  // }

  // handleBackButtonClick() {
  //   this.props.navigation.goBack(null);
  //   return true;
  // }
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
  // getCaptainData = async () => {
  //   console.log("get", this.state.currentLatitude, this.state.currentLongitude);
  //   this.setState({ isLoading: true });
  //   let data = {
  //     Pagnumber: 1,
  //     NoOfRows: 100,
  //     Type: 3,
  //     User_latitude: this.state.currentLatitude,
  //     User_longitude: this.state.currentLongitude,
  //   };
  //   console.log("get captain data", data);
  //   await getcaptaindata(data, this.state.token)
  //     .then((res) => {
  //       console.log("res:get captain data ", res);
  //       this.setState({
  //         UserData: res[0],
  //         isLoading: false,
  //       });
  //     })
  //     .catch((error) => {
  //       if (error.request) {
  //         console.log("request :", error.request);
  //         this.setState({ isLoading: false });
  //       }
  //       if (error.response) {
  //         console.log("response : ", error.response);
  //         this.setState({ isLoading: false });
  //       }
  //       console.log("comman error", error);
  //       this.showMessage("Server Error");
  //       console.log("im in catch");
  //       this.setState({ isLoading: false });
  //     });
  // };
  getSearchData = async () => {
    if (this.state.serach) {
      this.setState({ isLoading: true });
      let data = {
        User_Name: this.state.serach,
        Pagnumber: 1,
        NoOfRows: 100,
        Type: 3,
        User_latitude: this.state.currentLatitude,
        User_longitude: this.state.currentLongitude,
      };
      console.log("search data", data);
      await searchmasterdata(data, this.state.token)
        .then((res) => {
          console.log("res:searchmasterdata ", res[0][0]);
          this.setState({
            userData: res[0][0],
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
    }
  };
  render() {
    const { userData, isLoading } = this.state;
    return (
      <View>
        <SafeAreaView>
          <HeaderArrow title="Player" navigation={this.props.navigation} />

          <View style={{ backgroundColor: "white", height: "100%" }}>
            <Spinner visible={isLoading} />
            <View style={{ marginHorizontal: "4%" }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {/* <SearchableDropdown
                  // onTextChange={(text) => console.log(text)}
                  // Listner on the searchable input
                  onItemSelect={(item) => console.log(item)}
                  // Called after the selection
                  containerStyle={{ width: "100%", marginTop: 10 }}
                  // Suggestion container style
                  textInputStyle={{
                    // Inserted text style

                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#ccc",
                    backgroundColor: "#FAF7F6",
                  }}
                  itemStyle={{
                    // Single dropdown item style
                    padding: 10,
                    marginTop: 2,
                    backgroundColor: "#FAF9F8",
                    borderColor: "#bbb",
                    borderWidth: 1,
                  }}
                  itemTextStyle={{
                    // Text style of a single dropdown item
                    color: "#222",
                  }}
                  itemsContainerStyle={{
                    // Items container style you can pass maxHeight
                    // To restrict the items dropdown hieght
                    maxHeight: "60%",
                  }}
                  items={userData}
                  setSort={(item, searchedText) =>
                    item.User_Name.toLowerCase().startsWith(
                      searchedText.toLowerCase()
                    )
                  }
                  // Mapping of item array
                  defaultIndex={2}
                  // Default selected item index
                  textInputProps={{
                    placeholder: "placeholder",
                    underlineColorAndroid: "transparent",
                    style: {
                      padding: 12,
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 5,
                    },
                    onTextChange: (text) => alert(text),
                  }}
                  listProps={{
                    nestedScrollEnabled: true,
                  }}
                  // place holder for the search input
                  resPtValue={false}
                  // Reset textInput Value with true and false state
                  underlineColorAndroid="transparent"
                  // To remove the underline from the android input
                /> */}
                {/* <View
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
                    placeholder="Search"
                    value={this.state.serach}
                    style={{ marginLeft: 20, width: "85%" }}
                    onEndEditing={() => this.getSearchData()}
                    onChangeText={(serach) => {
                      this.setState({ serach });
                    }}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        serach: "",
                      })
                    }
                  >
                    <Entypo
                      name="cross"
                      size={25}
                      style={{ marginRight: 20 }}
                      color="lightgray"
                    />
                  </TouchableOpacity>
                </View> */}
              </View>
              <View style={{ marginTop: 20 }}>
                <Text
                  style={{
                    marginBottom: 10,
                    marginLeft: 40,
                    color: "gray",
                    fontWeight: "bold",
                    fontStyle: "italic",
                  }}
                >
                  Results
                </Text>
                <TouchableOpacity
                  style={{
                    // backgroundColor: "pink",
                    height: 100,
                    width: 100,
                    top: 30,
                    position: "absolute",
                    zIndex: 10000,
                  }}
                  onPress={() => this.props.navigation.goBack(null)}
                >
                  <AntDesign
                    onPress={() => this.props.navigation.goBack(null)}
                    name="left"
                    size={30}
                    style={{
                      position: "absolute",
                      left: 40,
                      fontWeight: "bold",
                      // backgroundColor: "red",
                    }}
                    color="#CA5328"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    // elevation: 20,
                  }}
                >
                  <Image
                    style={{ height: 200, width: 200, borderRadius: 100 }}
                    source={{
                      uri: userData.User_Image_Path
                        ? userData.User_Image_Path
                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/1200px-Unknown_person.jpg",
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 30,
                  marginBottom: 90,
                }}
              >
                <Text
                  style={{
                    fontSize: 40,
                    fontFamily: "muro",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    // fontFamily: "KanedaGothic-BoldItalic",
                  }}
                >
                  {userData.User_Name}
                </Text>
                {/* <Text
                  style={{
                    fontSize: 30,
                    color: "gray",
                    fontFamily: "KanedaGothic-BoldItalic",
                  }}
                >
                  SF/PF
                </Text> */}
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("PlayerProfile", {
                      UserId: userData.User_PkeyID,
                    })
                  }
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
                  <Text style={{ color: "white", fontSize: 20 }}>
                    VIEW PROFILE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
