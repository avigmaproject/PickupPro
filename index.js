/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import messaging from "@react-native-firebase/messaging";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
// ////
// // Define your Headless task -- simply a javascript async function to receive
// // events from BackgroundGeolocation:
// //
// let HeadlessTask = async (event) => {
//   let params = event.params;
//   console.log("[BackgroundGeolocation HeadlessTask] -", event.name, params);

//   switch (event.name) {
//     case "heartbeat":
//       // Use await for async tasks
//       let location = await getCurrentPosition();
//       console.log(
//         "[BackgroundGeolocation HeadlessTask] - getCurrentPosition:",
//         location
//       );
//       break;
//   }
// };

// ////
// // You're free to execute any API method upon BackgroundGeolocation in your HeadlessTask.
// // Just be sure to wrap them in a Promise and "await" their completion.
// //
// let getCurrentPosition = () => {
//   return new Promise((resolve) => {
//     BackgroundGeolocation.getCurrentPosition(
//       {
//         samples: 1,
//         persist: false,
//       },
//       (location) => {
//         resolve(location);
//       },
//       (error) => {
//         resolve(error);
//       }
//     );
//   });
// };

// ////
// // Register your HeadlessTask with BackgroundGeolocation plugin.
// //
// BackgroundGeolocation.registerHeadlessTask(HeadlessTask);
