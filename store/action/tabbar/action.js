export const showTabBar = (status) => {
  console.log("status", status);
  return (dispatch) => {
    dispatch({ type: "TAB_BAR", status });
  };
};
export const showTabBar1 = (status1) => {
  console.log("status", status1);
  return (dispatch) => {
    dispatch({ type: "TAB_BAR1", status1 });
  };
};
