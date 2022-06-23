import axios from "axios";
import { API } from "./base";
import NetInfo from "@react-native-community/netinfo";

// Create axios client, pre-configured with baseURL

const axiosTiming = (instance) => {
  instance.interceptors.request.use((request) => {
    request.ts = Date.now();
    // console.log("request send", request);
    return request;
  });
  NetInfo.fetch().then((state) => {
    if (state.isConnected) {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    } else {
      alert("plzz check internet connection");
    }
  });

  instance.interceptors.response.use((response) => {
    const timeInMs = `${Number(Date.now() - response.config.ts).toFixed()}ms`;
    response.latency = timeInMs;
    // console.log("response recived", response);

    return response;
  });
};
axiosTiming(axios);

export const register = async (data) => {
  return axios(API.REGISTRATION_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const login = async (data) => {
  return axios(API.LOGIN_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    data,
  })
    .then((response) => {
      console.log("Response latency: ", response.latency);
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
export const registerStoreImage = async (data, access_token) => {
  return axios(API.STORE_IMAGE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const forgotpassword = async (data) => {
  console.log(data);
  return axios(API.FORGOT_PASSWORD, {
    method: "POST",
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const userprofile = async (data, access_token) => {
  return axios(API.GET_USER_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const updateprofile = async (data, access_token) => {
  return axios(API.UPDAT_USER_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const courtdata = async (data, token) => {
  // console.log(data);
  return axios(API.GET_COURT_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const postcourtdata = async (data, token) => {
  // console.log(data);
  return axios(API.POST_COURT_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const getcaptaindata = async (data, token) => {
  // console.log(data);
  return axios(API.GET_CAPTAIN_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const searchmasterdata = async (data, token) => {
  // console.log(data);
  return axios(API.GET_SEARCH_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const postcaptaindata = async (data, token) => {
  // console.log(data);
  return axios(API.POST_CAPTAIN_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const postleftteamdata = async (data, token) => {
  // console.log(data);
  return axios(API.POST_LEFT_TEAM_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const postrightteamdata = async (data, token) => {
  // console.log(data);
  return axios(API.POST_RIGHT_TEAM_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const postgamedata = async (data, token) => {
  // console.log(data);
  return axios(API.POST_COURT_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const getteamdata = async (data, token) => {
  // console.log(data);
  return axios(API.GET_TEAM_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const addgameplayerdata = async (data, token) => {
  // console.log(data);
  return axios(API.ADD_GAME_PLAYER_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const releasplayerdata = async (data, token) => {
  // console.log(data);
  return axios(API.RELEASE_PLAYER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const selectedplayer = async (data, token) => {
  // console.log(data);
  return axios(API.SELECTED_TEAM, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const gamescoredatail = async (data, token) => {
  // console.log(data);
  return axios(API.GAME_SCORE_DETAIL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const getplayerdata = async (data, token) => {
  // console.log(data);
  return axios(API.GET_PLAYER_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const serachcourtdata = async (data, token) => {
  // console.log(data);
  return axios(API.SEARCH_COURT_DATA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const updatelatlong = async (data, token) => {
  // console.log(data);
  return axios(API.UPDATE_LAT_LONG, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const userranting = async (data, token) => {
  // console.log(data);
  return axios(API.USER_RATING, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const gethomedetail = async (data, token) => {
  // console.log(data);
  return axios(API.GET_HOME_DETAILS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const getcurrentgamedetails = async (data, token) => {
  // console.log(data);
  return axios(API.GET_CURRENT_GAME_DETAILS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
export const proposegameend = async (data, token) => {
  // console.log(data);
  return axios(API.PROPOSE_END_GAME, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
