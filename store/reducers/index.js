import { combineReducers } from "redux";
import authReducer from "./auth";
import tabReducer from "./tabbar";
// import teamReducer from "./teamdata";

export default combineReducers({
  authReducer,
  tabReducer,
  // teamReducer,
});
