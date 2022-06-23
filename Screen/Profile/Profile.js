import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  BackHandler,
  SafeAreaView,
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import HeaderArrow from "../../SmartComponent/Header/HeaderArrow";
import ImagePicker from "react-native-image-crop-picker";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import Spinner from "react-native-loading-spinner-overlay";
import { userprofile } from "../../utils/ConfigApi";
import { connect } from "react-redux";
import { updateprofile, registerStoreImage } from "../../utils/ConfigApi";
import qs from "qs";
import { Toast } from "native-base";
import CustomButton from "../../SmartComponent/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const options = [
  "Cancel",
  <View>
    {/* <EvilIcons
        name="pencil"
        size={35}
        //   style={{ marginRight: 20 }}
        // color=""
      /> */}
    <Text style={{ color: "black" }}>Gallery</Text>
  </View>,
  <Text style={{ color: "black" }}>Camera</Text>,
];
class Profile extends Component {
  constructor() {
    super();
    this.state = {
      base64: "",
      fileName: "image",
      imagePath: "",
      isShowPassword: true,
      isShowCPassword: true,
      userData: {
        username: null,
        password: null,
        cpassword: null,
        firstname: null,
        userid: null,
      },
      ErrorUserName: null,
      ErrorPassword: null,
      ErrorUserEmail: null,
      ErrorCpassword: null,
      ErrorCpassword1: null,
      ErrorName: null,
      isLoading: false,
      token: null,
      UserId: null,
    };
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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
  componentDidMount = () => {
    const { navigation } = this.props;
    this._unsubscribe = navigation.addListener("focus", () => {
      this.getToken();
    });
  };
  componentWillUnmount() {
    this._unsubscribe;
    // BackgroundGeolocation.removeAllListeners();
  }
  getUserData = async () => {
    // const { username, } = this.state;
    this.setState({
      ErrorUserName: null,
      isLoading: true,
      ErrorPassword: null,
    });
    var data = JSON.stringify({
      Type: 2,
    });
    // console.log("datadtaadtadag", data, this.props.userToken);
    await userprofile(data, this.state.token)
      .then((res) => {
        console.log("res: user profile", res);
        this.setState({
          userData: {
            username: res[0][0].User_Email,
            firstname: res[0][0].User_Name,
            password: res[0][0].User_Password,
            cpassword: res[0][0].User_Password,
            userid: res[0][0].User_PkeyID,
          },
          UserId: res[0][0].User_PkeyID,
          imagePath: res[0][0].User_Image_Path,
          ErrorUserEmail: null,
          ErrorPassword: null,
          isLoading: false,
        });
      })
      .catch((error) => {
        if (error.request) {
          console.log("request", error.request);
          this.setState({
            isLoading: false,
          });
        } else if (error.responce) {
          console.log("responce", error.responce);
          this.setState({
            isLoading: false,
          });
        } else {
          console.log("error", error);
          this.setState({
            isLoading: false,
          });
        }
      });
    // .catch((error) => {
    //   console.log("hihihihihihih", { e: error.response.data.error });
    //   let message = "";
    //   if (error.response) {
    //     // const {
    //     //   data: { error_description },
    //     // } = error.response;
    //     // message = error_description;
    //     //   if (error.response.data.error === "-90") {
    //     //     this.showMessage("User is already exist with email");
    //     //   }
    //     this.setState({ isLoading: false });
    //   } else {
    //     message = "";
    //   }
    //   console.log({ message });
    // });
  };
  onUsernameChange = (username) => {
    this.setState({
      userData: {
        ...this.state.userData,
        username,
      },
    });
  };
  onNameChange = (firstname) => {
    this.setState({
      userData: {
        ...this.state.userData,
        firstname,
      },
    });
  };
  onPasswordChange = (password) => {
    this.setState({
      userData: {
        ...this.state.userData,
        password,
      },
    });
  };
  onCPasswordChange = (cpassword) => {
    this.setState({
      userData: {
        ...this.state.userData,
        cpassword,
      },
    });
  };
  managePasswordVisibility = () => {
    this.setState({ isShowPassword: !this.state.isShowPassword });
  };
  manageCPasswordVisibility = () => {
    this.setState({ isShowCPassword: !this.state.isShowCPassword });
  };
  Validation = () => {
    this.setState({ isLoading: false });
    const { firstname, username, password, cpassword } = this.state.userData;
    console.log("hihihihiihihhi", this.state.userData);
    // debugger;
    const invalidFields = [];
    if (!firstname) {
      invalidFields.push("firstname");
      this.setState({ ErrorName: "Name is required" });
    } else {
      console.log("else");
      this.setState({ ErrorName: null });
    }
    if (!username) {
      invalidFields.push("username");
      this.setState({ ErrorUserName: "Email address is required" });
    } else {
      console.log("else");
      this.setState({ ErrorUserName: null });
    }
    if (!password) {
      invalidFields.push("password");
      this.setState({ ErrorPassword: "Password is required" });
    } else {
      this.setState({ ErrorPassword: null });
    }
    if (!cpassword) {
      invalidFields.push("cpassword");
      this.setState({ ErrorCpassword: "Confirm Password is required" });
    } else {
      this.setState({ ErrorCpassword: null });
    }
    if (cpassword !== password) {
      invalidFields.push("cpassword&password");
      this.setState({
        ErrorCpassword1: "Password and Confirm Password should match",
      });
    } else {
      this.setState({ ErrorCpassword1: null });
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
  onPress = () => this.ActionSheet.show();
  ImageGallery = async () => {
    setTimeout(
      function () {
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
          includeBase64: true,
          multiple: false,
          compressImageQuality: 0.5,
        }).then((image) => {
          console.log(image.data);
          this.setState(
            {
              base64: image.data,
              fileName:
                Platform.OS === "ios" ? image.filename : "images" + new Date(),
              imagePath: image.path,
            },
            () => {
              this.uploadImage();
            }
          );
        });
      }.bind(this),
      2000
    );
  };
  ImageCamera = () => {
    setTimeout(
      function () {
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
          includeBase64: true,
          multiple: false,
          compressImageQuality: 0.5,
        }).then((image) => {
          console.log(image);
          this.setState(
            {
              base64: image.data,
              fileName:
                Platform.OS === "ios" ? image.filename : "images" + new Date(),
              imagePath: image.path,
            },
            () => {
              this.uploadImage();
            }
          );
        });
      }.bind(this),
      2000
    );
  };
  uploadImage = async () => {
    const { base64 } = this.state;
    // console.log("base64base64base64base64", base64);
    let data = JSON.stringify({
      Type: 6,
      User_Image_Path_Base64: "data:image/png;base64, " + base64,
    });
    const token = await AsyncStorage.getItem("token");
    await registerStoreImage(data, token)
      .then((res) => {
        console.log("res:", res);
        this.props.navigation.navigate("Search");
      })
      .catch((error) => {
        if (error.request) {
          console.log(error.request);
        } else if (error.responce) {
          console.log(error.responce);
        } else {
          console.log(error);
        }
      });
  };
  getToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem("token");
      if (token) {
        // await AsyncStorage.removeItem("token");
        this.setState(
          {
            token,
          },
          () => this.getUserData()
        );
        // console.log(token);
      } else {
        console.log("no token found");
      }
    } catch (e) {
      console.log(e);
    }
    // console.log("userTokannnnnn", token);
  };
  UpdateProfile = async () => {
    this.setState({ isLoading: false });
    const validate = this.Validation();
    if (!validate) {
      const {
        username,
        password,
        firstname,
        token,
        userid,
      } = this.state.userData;

      this.setState({ isLoading: true });

      let data = {
        User_PkeyID: userid,
        User_Email: username,
        User_Password: password,
        User_Name: firstname,
        Type: 2,
      };
      console.log(data);

      await updateprofile(data, token)
        .then((res) => {
          console.log("res: ", res);

          this.setState({ isLoading: false });
          this.showMessage("User updated successfully");
        })
        .catch((error) => {
          console.log("errrrorrrr", { e: error.response.data.error });
          let message = "";
          if (error.request) {
            this.setState({ isLoading: false });
            this.showMessage("Unable to Update ,error in request");
          }
          if (error.response) {
            const {
              data: { error_description },
            } = error.response;
            message = error_description;
            if (error.response.data.error === "-99") {
              this.showMessage("User is already exist");
            }
            this.setState({ isLoading: false });
          }
          if (error) {
            this.setState({ isLoading: false });
            this.showMessage("Unable to Update");
          }
          console.log({ message });
        });
    }
  };
  // logOut = async () => {
  //   const { navigation } = this.props;

  //   let token;
  //   try {
  //     token = await AsyncStorage.getItem("token");
  //     if (token) {
  //       console.log("logoutogout", token);
  //       await AsyncStorage.removeItem("token");
  //       navigation.reset({
  //         index: 0,
  //         routes: [{ name: "Welcome" }],
  //       });
  //     } else {
  //       console.log("no token found");
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   // console.log("userTokannnnnn", token);
  // };

  showMessage = (message) => {
    if (message !== "" && message !== null && message !== undefined) {
      Toast.show({
        text: message,
        // style: styles.toasttxt,
        duration: 3000,
      });
    }
  };
  render() {
    const { isLoading, token } = this.state;
    // console.log("==================");
    // console.log(token);
    // console.log("==================");

    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView>
          <HeaderArrow title="Profile" navigation={this.props.navigation} />
          <Spinner visible={isLoading} />

          <ScrollView>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
              }}
            >
              <View
                style={{
                  //   justifyContent: "center",
                  alignItems: "center",
                  marginTop: 30,
                  width: "70%",
                  // backgroundColor: "pink",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.onPress()}
                  style={{
                    backgroundColor: "#4850CF",
                    borderRadius: 25,
                    height: 50,
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    zIndex: 1,
                    right: 60,
                    bottom: 10,
                  }}
                >
                  <View>
                    <EvilIcons
                      name="pencil"
                      size={30}
                      //   style={{ marginRight: 20 }}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
                <ActionSheet
                  ref={(o) => (this.ActionSheet = o)}
                  title={
                    <Text style={{ color: "#000", fontSize: 18 }}>
                      Profile Photo
                    </Text>
                  }
                  options={options}
                  cancelButtonIndex={0}
                  destructiveButtonIndex={4}
                  useNativeDriver={true}
                  onPress={(index) => {
                    if (index === 0) {
                      // cancel action
                    } else if (index === 1) {
                      this.ImageGallery();
                    } else if (index === 2) {
                      this.ImageCamera();
                    }
                  }}
                />
                <Image
                  style={{
                    height: 150,
                    width: 150,
                    borderRadius: 75,
                  }}
                  source={{
                    uri: this.state.imagePath
                      ? this.state.imagePath
                      : "https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg",
                  }}
                />
              </View>
            </View>
            <View
              style={{
                alignItems: "center",
                backgroundColor: "white",
                flex: 1,
                // height: 500,
                marginBottom: 100,
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
                }}
              >
                <TextInput
                  placeholder="Name"
                  value={this.state.userData.firstname}
                  onChangeText={this.onNameChange}
                  // keyboardType={"email-address"}
                  style={{ marginLeft: 10, width: "85%" }}
                />
              </View>
              <View style={{ width: "90%" }}>
                {this.state.ErrorName && (
                  <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
                    {this.state.ErrorName}
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
                  editable={false}
                  value={this.state.userData.username}
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
                  value={this.state.userData.password}
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
                      color="lightgray"
                    />
                  ) : (
                    <Feather
                      name="eye-off"
                      size={25}
                      style={{ marginRight: 20 }}
                      color="lightgray"
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
                  placeholder="Confirm Password"
                  value={this.state.userData.cpassword}
                  onChangeText={this.onCPasswordChange}
                  // keyboardType={"visible-password"}
                  style={{ marginLeft: 20, width: "85%" }}
                  secureTextEntry={this.state.isShowCPassword}
                />
                <TouchableOpacity
                  onPress={() => this.manageCPasswordVisibility()}
                >
                  {this.state.isShowCPassword ? (
                    <Feather
                      name="eye"
                      size={25}
                      style={{ marginRight: 20 }}
                      color="lightgray"
                    />
                  ) : (
                    <Feather
                      name="eye-off"
                      size={25}
                      style={{ marginRight: 20 }}
                      color="lightgray"
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={{ width: "90%" }}>
                {this.state.ErrorCpassword1 && (
                  <Text style={{ color: "red", marginTop: 5, marginRight: 30 }}>
                    {this.state.ErrorCpassword1}
                  </Text>
                )}
              </View>
              {/* <TouchableOpacity
              onPress={() => this.UpdateProfile()}
              style={{
                backgroundColor: "#4850CF",
                height: 50,
                width: "70%",
                borderRadius: 10,
                marginTop: 20,
                marginBottom: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 15, marginRight: "3%" }}>
                Update Profile
              </Text>
            </TouchableOpacity> */}
              <View
                style={{
                  // backgroundColor: "pink",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <TouchableOpacity
                style={{
                  // backgroundColor: "pink",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => this.UpdateProfile()}
              > */}
                <CustomButton
                  title="Update Profile"
                  onPress={() => this.UpdateProfile()}
                />
                {/* </TouchableOpacity> */}
                <View
                  style={{
                    // backgroundColor: "pink",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CustomButton
                    title="View Stats"
                    onPress={() =>
                      this.props.navigation.navigate("PlayerProfile", {
                        UserId: this.state.UserId,
                        show: false,
                      })
                    }
                  />
                </View>
                {/* <TouchableOpacity
                style={{
                  // backgroundColor: "pink",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => this.logOut()}
              >
                <CustomButton title="Logout" />
              </TouchableOpacity> */}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  //   console.log(state);
  return {
    userToken: state.authReducer.userToken,
    // parentid: state.parentidReducer.parentid,
  };
};

// const mapDispatchToProps = {
//   setContacts,
//   setParentid,
// };

export default connect(mapStateToProps)(Profile);
