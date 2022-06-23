import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerStoreImage } from "../../utils/ConfigApi";

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

class ProfilePic extends Component {
  constructor() {
    super();
    this.state = {
      base64: "",
      fileName: "image",
      imagePath: "",
      token: null,
    };
  }
  componentDidMount() {
    console.log("route", this.props.route.params.token);
    this.setState({
      token: this.props.route.params.token,
    });
  }
  onHandleAlert = () =>
    Alert.alert(
      "Profile Picture",
      "This is how the scorekeeper will recognize you",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => this.onPress() },
      ]
    );
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
          this.setState({
            base64: image.data,
            fileName:
              Platform.OS === "ios" ? image.filename : "images" + new Date(),
            imagePath: image.path,
          });
        });
      }.bind(this),
      1000
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
          this.setState({
            base64: image.data,
            fileName:
              Platform.OS === "ios" ? image.filename : "images" + new Date(),
            imagePath: image.path,
          });
        });
      }.bind(this),
      1000
    );
  };
  uploadImage = async () => {
    const { base64, token } = this.state;
    // console.log("base64base64base64base64", base64);
    let data = JSON.stringify({
      Type: 6,
      User_Image_Path_Base64: "data:image/png;base64, " + base64,
    });
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
  showMessage = (message) => {
    if (message !== "" && message !== null && message !== undefined) {
      Toast.show({
        text: message,
        style: styles.toasttxt,
        duration: 5000,
      });
    }
  };
  render() {
    console.log("this.props.userToken", this.props.userToken);
    return (
      <View style={{ backgroundColor: "white" }}>
        <ScrollView>
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "KanedaGothic-BoldItalic",
                fontSize: 50,
                color: "#2f363c",
              }}
            >
              Upload your profile picture
            </Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View
              style={{
                //   justifyContent: "center",
                alignItems: "center",
                marginTop: 30,
                width: "70%",
                //   backgroundColor: "pink",
              }}
            >
              <TouchableOpacity
                onPress={() => this.onHandleAlert()}
                style={{
                  backgroundColor: "#4850CF",
                  borderRadius: 50,
                  height: 75,
                  width: 75,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  zIndex: 1,
                  right: 0,
                  bottom: 10,
                }}
              >
                <View>
                  <EvilIcons
                    name="pencil"
                    size={65}
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
                  height: 300,
                  width: 300,
                  borderRadius: 150,
                  borderColor: "gray",
                  borderWidth: 1,
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
              justifyContent: "center",
              alignItems: "center",
              marginTop: 40,
            }}
          >
            <TouchableOpacity
              onPress={() => this.uploadImage()}
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
                SELECT
              </Text>
              <AntDesign
                name="caretright"
                size={15}
                // style={{ marginRight: 20 }}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{
                activeOpacity: 1,
                height: 50,
                width: "70%",
                borderRadius: 10,
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                borderColor: "#4850CF",
                borderWidth: 1,
                marginBottom: 50,
                // backgroundColor:"lightgray"
              }}
            >
              <Text
                style={{
                  color: "#4850CF",
                  fontSize: 15,
                  marginRight: "3%",
                  fontWeight: "bold",
                }}
              >
                BACK
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  // console.log(state);
  return {
    userToken: state.authReducer.userToken,
    // parentid: state.parentidReducer.parentid,
  };
};

// const mapDispatchToProps = {
//   setContacts,
//   setParentid,
// };

export default connect(mapStateToProps)(ProfilePic);
