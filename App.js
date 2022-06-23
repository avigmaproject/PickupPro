import React, { Component } from "react";
import { Text, View, Image, Alert } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { connect } from "react-redux";
import store, { persistor } from "./store";
// import store, { persistor } from "./store";
import { releasplayerdata } from "./utils/ConfigApi";
import { NavigationContainer } from "@react-navigation/native";
import { Root } from "native-base";
import MyStack from "./Navigation/StackNavigation";
import MyStack2 from "./Navigation/StackNavigation1";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import BackgroundGeolocation from "react-native-background-geolocation";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameid: 0,
      token: null,
    };
  }
  getGameId = async () => {
    let gameid;
    try {
      gameid = await AsyncStorage.getItem("gameid");
      console.log("gameidcaptain", gameid);
      if (gameid !== null && gameid !== undefined && gameid !== "") {
        this.setState(
          {
            gameid,
          },
          () => this.getAccessToken()
        );
      } else {
        console.log("no gameid found");
      }
    } catch (e) {
      console.log(e);
    }
    console.log("logingameid", gameid);
  };
  getAccessToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem("token");
      console.log("teamgameid", token);
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
  EndGame = async () => {
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
        clearInterval(this.gamescore);
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
  componentDidMount() {
    this.configureBackgroundGeolocation();
    this.configurePushNotifications();
    this.notificationListener = messaging().onMessage(async (remoteMessage) => {
      const notification = remoteMessage.notification;
      // console.log("remoteMessage453453", notification, remoteMessage);
      // alert(notification);
      if (notification) {
        if (notification.title === "Propose to End Game") {
          this.getGameId();
          this.gamescore = setTimeout(() => this.EndGame(), 60000);
          Alert.alert(notification.title, notification.body, [
            {
              text: "Continue",
              onPress: () => {
                clearInterval(this.gamescore);
              },
              style: "cancel",
            },
          ]);
        } else {
          Alert.alert(notification.title, notification.body, [
            {
              text: "OK",
              onPress: () => {
                console.log(notification);
              },
              style: "cancel",
            },
          ]);
        }
      }
    });
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeAllListeners();
    this.notificationListener();
  }

  configurePushNotifications = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    } catch (error) {}
  };

  configureBackgroundGeolocation = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        BackgroundGeolocation.ready(
          {
            // Geolocation Config
            locationAuthorizationRequest: "WhenInUse",
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 10,
            isMoving: true,
            locationAuthorizationAlert: {
              titleWhenNotEnabled: "Yo, location-services not enabled",
              titleWhenOff: "Yo, location-services OFF",
              instructions:
                "You must enable 'Always' in location-services, buddy",
              cancelButton: "Cancel",
              settingsButton: "Settings",
            },
            notification: {
              title: "Background tracking engaged",
              text: "My notification text",
            },
            // Activity Recognition
            stopTimeout: 1,
            // Application config
            debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            enableHeadless: true,
            stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
            startOnBoot: true, // <-- Auto start tracking when device is powered-up.
            // HTTP / SQLite config
            url:
              "http://pickupproapi.ikaart.org/api/PickupPro/AddUserMasterData",
            batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
            autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            locationTemplate:
              '{"User_latitude":<%= latitude %>,"User_longitude":<%= longitude %>}',
            params: {
              Type: 7,
            },
          },
          (state) => {
            if (!state.enabled) {
              ////
              // 3. Start tracking!
              //
              BackgroundGeolocation.start();
            }
          }
        );
      }
    } catch (error) {}
  };

  render() {
    return (
      <Root>
        <NavigationContainer>
          <MyStack />
          {/* {token == null ? <MyStack /> : <MyStack2 />} */}

          {/* {userToken == null ? <MyStack /> : <MyStack2 />} */}
        </NavigationContainer>
      </Root>
    );
  }
}

// const App = () => {
//   const [token, settoken] = React.useState(null);
//   const userToken = useSelector((state) => state.authReducer.userToken);
//   const mode = useSelector((state) => state.authReducer.registerMode);
//   // console.log("modemodemodemodeapp", mode);
//   // console.log("userTokenApp", userToken);

//   return (
//     <Root>
//       <NavigationContainer>
//         <MyStack />
//         {/* {token == null ? <MyStack /> : <MyStack2 />} */}

//         {/* {userToken == null ? <MyStack /> : <MyStack2 />} */}
//       </NavigationContainer>
//     </Root>
//   );
// };

// const App = () => (
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//   <Root>
//     <NavigationContainer>
//       <MyStack />
//     </NavigationContainer>
//   </Root>
//     </PersistGate>
//   </Provider>
// );

const AppWrapper = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
export default AppWrapper;
