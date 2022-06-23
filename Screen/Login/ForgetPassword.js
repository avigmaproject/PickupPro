import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Spinner from "react-native-loading-spinner-overlay";
import { forgotpassword } from "../../utils/ConfigApi";
import qs from "qs";
import { Toast } from "native-base";

export default class ForgetPassword extends Component {
  constructor() {
    super();
    this.state = {
      username: null,
      password: null,
      ErrorUserName: null,
      clientid: 1,
      role: 2,
      isLoading: false,
    };
  }
  Validation = () => {
    this.setState({ isLoading: false });
    const invalidFields = [];

    if (!this.state.username) {
      invalidFields.push("username");
      this.setState({ ErrorUserName: "Email address is required" });
    } else {
      console.log("else");
      this.setState({ ErrorUserName: null });
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
  ForgotPassword = async () => {
    const { username } = this.state;
    this.setState({
      ErrorUserName: null,
      isLoading: true,
      ErrorPassword: null,
    });
    let data = JSON.stringify({
      EmailID: username,
    });
    console.log("datadtaadtadag", data);
    if (username) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(this.state.username) === false && this.state.username) {
        this.setState({
          ErrorUserEmail: "Please enter valid email",
          isLoading: false,
        });
      } else {
        this.setState({
          ErrorUserEmail: null,
          ErrorPassword: null,
          isLoading: true,
        });
        await forgotpassword(data)
          .then((res) => {
            console.log("res: ", res);
            this.setState({
              ErrorUserEmail: null,
              ErrorPassword: null,
              isLoading: false,
            });
            this.showMessage(
              "Link has been sent to your mentioned email address"
            );
          })
          .catch((error) => {
            console.log("hihihihihihih", { e: error.response.data.error });
            let message = "";
            if (error.response) {
              const {
                data: { error_description },
              } = error.response;
              message = error_description;
              if (error.response.data.error === "-90") {
                this.showMessage("User is already exist with email");
              }
              this.setState({ isLoading: false });
            } else {
              message = "";
            }
            console.log({ message });
          });
      }
    } else {
      this.setState({
        ErrorUserName: "Email address is required",
        isLoading: false,
        ErrorPassword: null,
      });
      // this.setState({  });
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
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "red" }}>
        <ImageBackground
          style={{ width: "100%", flex: 1 }}
          resizeMode="cover"
          source={require("../../assets/icons_folder/background.jpg")}
        >
          <Spinner visible={this.state.isLoading} />
          <View
            style={{
              marginTop: 40,
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Image
              resizeMode="stretch"
              style={{ width: "40%", height: 150, marginBottom: 20 }}
              source={require("../../assets/Logo1.png")}
            />

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
              <View
                style={{
                  width: "90%",
                  marginTop: 20,
                  height: 50,
                  borderWidth: 1,
                  borderColor: "lightgray",
                  borderRadius: 6,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="gray"
                  value={this.state.username}
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

              <TouchableOpacity
                onPress={() => this.ForgotPassword()}
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
                    fontSize: 15,
                    marginRight: "3%",
                    fontWeight: "bold",
                  }}
                >
                  SEND LINK
                </Text>
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
                marginBottom: 10,
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
        </ImageBackground>
        <View
          style={{
            width: "100%",
            height: 10,
            backgroundColor: "#CA5328",
            position: "absolute",
            bottom: 0,
          }}
        ></View>
      </View>
    );
  }
}
