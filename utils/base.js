// const BASE_URL = "http://pickupproapi.ikaart.org";
const BASE_URL = "http://api.pickupprobasketball.com";

export const API = {
  LOGIN_API: BASE_URL + "/token",
  REGISTRATION_API: BASE_URL + "/token",
  STORE_IMAGE_API: BASE_URL + "/api/PickupPro/AddUserMasterData",
  FORGOT_PASSWORD: BASE_URL + "/api/PickupPro/ForGotPassword",
  GET_USER_DATA: BASE_URL + "/api/PickupPro/GetUserMasterData",
  UPDAT_USER_DATA: BASE_URL + "/api/PickupPro/AddUserMasterData",
  GET_COURT_DATA: BASE_URL + "/api/PickupPro/GetCourtMasters",
  POST_COURT_DATA: BASE_URL + "/api/PickupPro/AddGameMasterData",
  GET_CAPTAIN_DATA: BASE_URL + "/api/PickupPro/GetUserMasterList",
  GET_SEARCH_DATA: BASE_URL + "/api/PickupPro/GetUserMasterList",
  POST_CAPTAIN_DATA: BASE_URL + "/api/PickupPro/AddTeamMasterData",
  POST_LEFT_TEAM_DATA: BASE_URL + "/api/PickupPro/AddPlayerTeamMasterData",
  POST_RIGHT_TEAM_DATA: BASE_URL + "/api/PickupPro/AddPlayerTeamMasterData",
  GET_TEAM_DATA: BASE_URL + "/api/PickupPro/GetStartGameUserData",
  ADD_GAME_PLAYER_DATA:
    BASE_URL + "/api/PickupPro/AddGamePlayerTableMasterData",
  SELECTED_TEAM: BASE_URL + "/api/PickupPro/GetUserMasterList",
  // SELECTED_TEAM: BASE_URL + "/api/PickupPro/GetUserMasterList",
  RELEASE_PLAYER: BASE_URL + "/api/PickupPro/EndGame",
  GAME_SCORE_DETAIL: BASE_URL + "/api/PickupPro/GetGameScoreDetails",
  GET_PLAYER_DATA: BASE_URL + "/api/PickupPro/GetPlayerStaticsDetails",
  SEARCH_COURT_DATA: BASE_URL + "/api/PickupPro/GetCourtMasters",
  UPDATE_LAT_LONG: BASE_URL + "/api/PickupPro/AddUserMasterData",
  USER_RATING: BASE_URL + "/api/PickupPro/AddUpdatePlayerTeamRating",
  GET_HOME_DETAILS: BASE_URL + "/api/PickupPro/GetHomeDetails",
  GET_CURRENT_GAME_DETAILS: BASE_URL + "/api/PickupPro/GetCurrentGameDetails",
  PROPOSE_END_GAME: BASE_URL + "/api/PickupPro/PropseEndGame",
};
// http://pickupproapi.ikaart.org/api/PickupPro/GetPlayerStaticsDetails
