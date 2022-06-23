import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import { register } from "../../utils/ConfigApi";
import qs from "qs";
import { connect } from "react-redux";
import { registerMode, setToken } from "../../store/action/auth/action";
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Geolocation from "react-native-geolocation-service";

import { Toast } from "native-base";
class Register extends Component {
  constructor() {
    super();
    this.state = {
      isShowPassword: true,
      firstname: null,
      username: null,
      password: null,
      access_token: "",
      clientid: 2,
      grant_type: "password",
      role: 2,
      isLoading: false,
      ErrorUserName: null,
      ErrorPassword: null,
      ErrorFirstName: null,
      currentLatitude: null,
      currentLongitude: null,
      ErrorUserEmail: null,
    };
  }
  managePasswordVisibility = () => {
    this.setState({ isShowPassword: !this.state.isShowPassword });
  };
  onPressRegister = async () => {
    this.setState({ isLoading: false });
    this.getLocation();
    const validate = this.Validation();
    console.log("validate", validate);
    if (!validate) {
      const {
        username,
        password,
        firstname,
        clientid,
        role,
        grant_type,
      } = this.state;

      this.setState({ isLoading: true });

      let data = qs.stringify({
        grant_type: grant_type,
        username: username,
        password: password,
        ClientId: clientid,
        FirstName: firstname,
        role: role,
        User_latitude: this.state.currentLatitude,
        User_longitude: this.state.currentLongitude,
      });
      console.log(data);
      await register(data)
        .then((res) => {
          // console.log("res: ", JSON.stringify(res), res.access_token);
          console.log("res: ", res.error, res.access_token);

          this.setState({ isLoading: false });
          // this.props.setToken(res.access_token);
          // this.props.registerMode(true);
          AsyncStorage.setItem("token", res.access_token);
          this.props.navigation.navigate("ProfilePic", {
            token: res.access_token,
          });
        })
        .catch((error) => {
          console.log({ e: error.response.data.error });
          let message = "";
          if (error.response) {
            const {
              data: { error_description },
            } = error.response;
            message = error_description;
            if (error.response.data.error === "-99") {
              this.showMessage("User is already exist");
            }
            this.setState({ isLoading: false });
          } else {
            message = "";
          }
          console.log({ message });
        });
    }
  };
  showMessage = (message) => {
    if (message !== "" && message !== null && message !== undefined) {
      Toast.show({
        text: message,
        // style: styles.toasttxt,
        duration: 5000,
      });
    }
  };
  Validation = () => {
    this.setState({ isLoading: false });
    // debugger;
    const invalidFields = [];
    if (!this.state.firstname) {
      invalidFields.push("firstname");
      this.setState({ ErrorFirstName: "First Name is required" });
    } else {
      console.log("else");
      this.setState({ ErrorFirstName: null });
    }
    if (!this.state.username) {
      invalidFields.push("username");
      this.setState({ ErrorUserName: "Email address is required" });
    } else {
      console.log("else");
      this.setState({ ErrorUserName: null });
    }
    if (!this.state.password) {
      invalidFields.push("password");
      this.setState({ ErrorPassword: "Password is required" });
    } else {
      this.setState({ ErrorPassword: null });
    }
    if (this.state.password.length < 4) {
      invalidFields.push("passwordlength");
      this.setState({
        ErrorPassword: "Password length is must greater then 4 ",
      });
    } else {
      this.setState({ ErrorPassword: null });
    }
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.username) === false && this.state.username) {
      invalidFields.push("ErrorUserEmail");
      this.setState({ ErrorUserEmail: "Please enter valid email" });
    } else {
      this.setState({ ErrorUserEmail: null });
    }
    return invalidFields.length > 0;
  };
  hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert("Unable to open settings");
      });
    };
    const status = await Geolocation.requestAuthorization("whenInUse");
    console.log("Check");
    if (status === "granted") {
      console.log("granted");
      return true;
    }

    if (status === "denied") {
      Alert.alert(
        `Turn on Location Services to allow pickuppro to determine your location.`,
        "",
        [
          {
            text: "Don't Use Location",
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]
      );

      console.log("denied");
    }

    if (status === "disabled") {
      Alert.alert(
        `Turn on Location Services to allow pickuppro to determine your location.`,
        "",
        [
          { text: "Go to Settings", onPress: openSetting },
          {
            text: "Don't Use Location",
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]
      );

      console.log("disable");
    }

    return false;
  };

  hasLocationPermission = async () => {
    if (Platform.OS === "ios") {
      const hasPermission = await this.hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === "android" && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        "Location permission denied by user.",
        ToastAndroid.LONG
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        "Location permission revoked by user.",
        ToastAndroid.LONG
      );
    }

    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      console.log("POst");
      return;
    }

    this.setState({ isLoading: true }, () => {
      // Geolocation.requestAuthorization("always");

      Geolocation.getCurrentPosition(
        (position) => {
          // console.log(
          //   position.coords.latitude,
          //   position.coords.longitude,
          //   "positionposition"
          // );
          this.setState(
            {
              currentLatitude: position.coords.latitude,
              currentLongitude: position.coords.longitude,
              isLoading: false,
            },

            () => this.saveLocation(),
            console.log(
              "locationnnnn",
              this.state.currentLatitude,
              this.state.currentLongitude
            )
          );
        },
        (error) => {
          this.setState({ isLoading: false });
          console.log(error);
        },
        {
          accuracy: {
            android: "high",
            ios: "best",
          },
          enableHighAccuracy: this.state.highAccuracy,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0,
          forceRequestLocation: this.state.forceLocation,
          showLocationDialog: this.state.showLocationDialog,
        }
      );
    });
  };
  saveLocation = async () => {
    const { currentLatitude, currentLongitude } = this.state;
    try {
      const latitude = ["latitude", JSON.stringify(currentLatitude)];
      const longitude = ["longitude", JSON.stringify(currentLongitude)];
      // const longitude = ["longitude", JSON.stringify(72.8619)];
      // const latitude = ["latitude", JSON.stringify(19.039)];

      await AsyncStorage.multiSet([latitude, longitude]);
      console.log("Set: ", latitude, longitude);
    } catch (error) {
      console.log(" Location error ", error);
    }
  };
  render() {
    return (
      <View>
        <ImageBackground
          style={{ height: "100%", width: "100%" }}
          resizeMode="cover"
          source={require("../../assets/icons_folder/background.jpg")}
        >
          <ScrollView>
            <Spinner visible={this.state.isLoading} />
            <View
              style={{
                marginTop: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                resizeMode="stretch"
                style={{ width: "35%", height: 150, marginBottom: 20 }}
                source={require("../../assets/Logo1.png")}
              />
              {/* <View style={{ flexDirection: "row", marginTop: 20 ,marginBottom:30}}>
							<Text style={{ fontSize: 60,marginRight:5,fontFamily:"KanedaGothic-BoldItalic" }}>PICK-UP</Text>
							<Text style={{ color: "#CA5328", fontSize: 60 ,fontFamily:"KanedaGothic-BoldItalic"}}>PRO</Text>
						</View> */}
              <View
                style={{
                  backgroundColor: "white",
                  // height: 450,
                  width: "85%",
                  alignItems: "center",
                  borderRadius: 10,
                  elevation: 60,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    color: "#4850CF",
                    marginTop: 20,
                    fontFamily: "KanedaGothic-BoldItalic",
                  }}
                >
                  Join the largest community-driven
                </Text>
                <Text
                  style={{
                    fontSize: 25,
                    color: "#4850CF",
                    fontFamily: "KanedaGothic-BoldItalic",
                  }}
                >
                  stat recording tool.
                </Text>
                <View
                  style={{
                    width: "90%",
                    marginTop: 20,
                    height: 50,
                    borderWidth: 1,
                    borderColor: "lightgray",
                    borderRadius: 6,
                    justifyContent: "center",
                  }}
                >
                  <TextInput
                    placeholder="Full Name"
                    value={this.state.firstname}
                    placeholderTextColor="gray"
                    style={{ marginLeft: 10, width: "85%" }}
                    onChangeText={(firstname) => {
                      this.setState({ firstname });
                    }}
                  />
                </View>
                <View style={{ width: "90%" }}>
                  {this.state.ErrorFirstName && (
                    <Text style={{ color: "red", marginTop: 5 }}>
                      {this.state.ErrorFirstName}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    width: "90%",
                    marginTop: 20,
                    height: 50,
                    borderWidth: 1,
                    borderColor: "lightgray",
                    borderRadius: 6,
                    justifyContent: "center",
                  }}
                >
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="gray"
                    value={this.state.username}
                    keyboardType={"email-address"}
                    style={{ marginLeft: 10, width: "85%" }}
                    onChangeText={(username) => {
                      this.setState({ username });
                    }}
                  />
                </View>
                <View style={{ width: "90%" }}>
                  {this.state.ErrorUserName && (
                    <Text style={{ color: "red", marginTop: 5 }}>
                      {this.state.ErrorUserName}
                    </Text>
                  )}
                </View>
                <View style={{ width: "90%" }}>
                  {this.state.ErrorUserEmail && (
                    <Text style={{ color: "red", marginTop: 5 }}>
                      {this.state.ErrorUserEmail}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    width: "90%",
                    marginTop: 20,
                    height: 50,
                    borderWidth: 1,
                    borderColor: "lightgray",
                    borderRadius: 6,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    placeholder="Password"
                    value={this.state.password}
                    placeholderTextColor="gray"
                    secureTextEntry={this.state.isShowPassword}
                    style={{ width: "90%", paddingHorizontal: 20 }}
                    onChangeText={(password) => {
                      this.setState({ password });
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => this.managePasswordVisibility()}
                  >
                    {this.state.isShowPassword ? (
                      <Feather
                        name="eye"
                        size={25}
                        style={{ marginRight: 20 }}
                        color="gray"
                      />
                    ) : (
                      <Feather
                        name="eye-off"
                        size={25}
                        style={{ marginRight: 20 }}
                        color="gray"
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={{ width: "90%" }}>
                  {this.state.ErrorPassword && (
                    <Text style={{ color: "red", marginTop: 5 }}>
                      {this.state.ErrorPassword}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => this.onPressRegister()}
                  style={{
                    backgroundColor: "#4850CF",
                    height: 50,
                    width: "70%",
                    borderRadius: 10,
                    marginTop: 20,
                    marginBottom: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
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
                    REGISTER
                  </Text>
                  <AntDesign
                    name="caretright"
                    size={15}
                    // style={{ marginRight: 20 }}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
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
                  BACK
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}
// const mapStateToProps = (state, ownProps) => ({
//   // contacts: state.contactReducer.contacts,
//   // parentid: state.parentidReducer.parentid,
// });

// const mapDispatchToProps = {
//   registerMode,
//   setToken,
// };
// export default connect(mapStateToProps, mapDispatchToProps)(Register);
export default Register;
