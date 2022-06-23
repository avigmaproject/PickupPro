import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Spinner from "react-native-loading-spinner-overlay";
import { login } from "../../utils/ConfigApi";
import qs from "qs";
import { Toast } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import firebase from "@react-native-firebase/app";

import Geolocation from "react-native-geolocation-service";
// import EvilIcons from "react-native-vector-icons/EvilIcons";
// import AntDesign from "react-native-vector-icons/AntDesign";
// import { connect } from "react-redux";
// import { registerMode, setToken } from "../../store/action/auth/action";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      isShowPassword: true,
      username: null,
      password: null,
      username: "",
      password: "",
      firstname: null,
      ErrorUserName: null,
      ErrorPassword: null,
      ErrorUserEmail: null,
      clientid: 1,
      role: 2,
      isLoading: false,
      grant_type: "password",
      access_token: "",
      forceLocation: true,
      highAccuracy: true,
      location: {},
      currentLatitude: 0,
      currentLongitude: 0,
      showLocationDialog: false,
      msgtoken: null,
    };
  }
  onUsernameChange = (username) => {
    this.setState({ username });
  };

  onPasswordChange = (password) => {
    this.setState({ password });
  };
  componentDidMount() {
    this.requestUserPermission();
    this.getLocation();
  }
  requestUserPermission = async () => {
    // if (!firebase.messaging().isDeviceRegisteredForRemoteMessages) {
    //   await firebase.messaging().registerDeviceForRemoteMessages();
    // }
    let authStatus = await firebase.messaging().hasPermission();
    if (authStatus !== firebase.messaging.AuthorizationStatus.AUTHORIZED) {
      authStatus = await firebase.messaging().requestPermission();
      // {
      //   alert: true,
      //   announcement: false,
      //   badge: true,
      //   carPlay: false,
      //   provisional: false,
      //   sound: true,
      // }
    }

    // const authStatus = await messaging().requestPermission();
    // const enabled =
    // authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    // authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (authStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED) {
      this.getFcmToken();
    }
  };

  async getFcmToken() {
    const fcmToken = await messaging().getToken();
    // console.log("hiiii", fcmToken);
    this.setState({ msgtoken: fcmToken });
  }
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
          // console.log("positionposition", position);
          this.setState(
            {
              currentLatitude: position.coords.latitude,
              currentLongitude: position.coords.longitude,
              isLoading: false,
            },
            () => this.saveLocation()
          );
        },
        (error) => {
          this.setState({ isLoading: false });
          console.log("loction time out", error);
          this.showMessage("Unable to find location");
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
      // const latitude = ["latitude", JSON.stringify(19.039)];
      // const longitude = ["longitude", JSON.stringify(72.8619)];

      const latitude = ["latitude", JSON.stringify(currentLatitude)];
      const longitude = ["longitude", JSON.stringify(currentLongitude)];
      await AsyncStorage.multiSet([latitude, longitude]);
      console.log("Set: ", latitude, longitude);
    } catch (error) {
      console.log(" Location error ", error);
    }
  };

  Validation = () => {
    this.setState({ isLoading: false });
    // debugger;
    const invalidFields = [];

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
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.username) === false && this.state.username) {
      invalidFields.push("ErrorUserEmail");
      this.setState({ ErrorUserEmail: "Please enter valid email" });
    } else {
      this.setState({ ErrorUserEmail: null });
    }
    return invalidFields.length > 0;
  };
  onPressLogin = async () => {
    this.setState({ isLoading: true });
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
        msgtoken,
      } = this.state;

      this.setState({ isLoading: true });
      let data = qs.stringify({
        grant_type: grant_type,
        username: username,
        password: password,
        ClientId: clientid,
        FirstName: "",
        IMEI: msgtoken,
      });
      console.log(data);
      await login(data)
        .then((res) => {
          console.log("res: ", JSON.stringify(res));
          console.log("res:123", res.access_token);
          this.setState({ isLoading: false, access_token: res.access_token });
          const token = res.access_token;
          AsyncStorage.setItem("token", token);
          this.props.navigation.navigate("Search");
          // this.props.setToken(token);
          // this.props.registerMode(false);
        })
        .catch((error) => {
          if (error.response) {
            console.log("responce_error", error.response.data.error);
            if (error.response.data.error == "0") {
              this.showMessage("The Email ID or password is incorrect.");
              this.setState({ isLoading: false });
            }
          } else if (error.request) {
            this.setState({ isLoading: false });
            console.log("request error", error.request);
          } else if (error) {
            this.showMessage("Server Error");
            this.setState({ isLoading: false });
          }
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
  managePasswordVisibility = () => {
    this.setState({ isShowPassword: !this.state.isShowPassword });
  };
  render() {
    const { isLoading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={{ height: "100%", width: "100%", flex: 1 }}
          resizeMode="cover"
          source={require("../../assets/icons_folder/background.jpg")}
        >
          <Spinner visible={isLoading} />

          <View
            style={{
              marginTop: 40,
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              // backgroundColor: "red",
            }}
          >
            <Image
              resizeMode="stretch"
              style={{ width: "45%", height: 200, marginBottom: 20 }}
              source={require("../../assets/Logo1.png")}
            />
            <View
              style={{
                backgroundColor: "white",
                // height: 280,
                width: "85%",
                alignItems: "center",
                borderRadius: 10,
                elevation: 60,
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: "90%",
                  marginTop: 20,
                  height: 50,
                  borderWidth: 1,
                  borderColor: "lightgray",
                  borderRadius: 6,
                  justifyContent: "center",
                  // alignItems: "center",
                }}
              >
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="gray"
                  value={this.state.username}
                  onChangeText={this.onUsernameChange}
                  keyboardType={"email-address"}
                  style={{ marginLeft: 10, width: "85%" }}
                />
              </View>
              <View style={{ width: "90%" }}>
                {this.state.ErrorUserName && (
                  <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
                    {this.state.ErrorUserName}
                  </Text>
                )}
              </View>
              <View style={{ width: "90%" }}>
                {this.state.ErrorUserEmail && (
                  <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
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
                  onChangeText={this.onPasswordChange}
                  // keyboardType={"visible-password"}
                  style={{ marginLeft: 20, width: "85%" }}
                  secureTextEntry={this.state.isShowPassword}
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
                  <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
                    {this.state.ErrorPassword}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => this.onPressLogin()}
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
                  LOG IN
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              // onPress={() => this.ForgotPassword()}
              onPress={() => this.props.navigation.navigate("ForgetPassword")}
              style={{
                justifyContent: "center",
                alignItems: "center",
                // marginBottom: 50,
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: 20,
                  textDecorationLine: "underline",
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Welcome")}
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
                marginBottom: 20,
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

          <View
            style={{ width: "100%", height: 10, backgroundColor: "#CA5328" }}
          ></View>
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
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default Login;
