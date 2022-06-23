export const initialState = {
  status: false,
  status1: false,
};

const reducer = (state = initialState, action) => {
  // console.log("actionaction", action.status);
  switch (action.type) {
    case "TAB_BAR": {
      return {
        ...state,
        status: action.status,
      };
    }
    case "TAB_BAR1": {
      return {
        ...state,
        status1: action.status1,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
