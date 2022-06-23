import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

export default class CustomeButton2 extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        // onPress={() => this.props.navigation.navigate("LiveGame")}
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
          {this.props.title}
        </Text>
        <AntDesign
          name="caretright"
          size={15}
          // style={{ marginRight: 20 }}
          color="white"
        />
      </TouchableOpacity>
    );
  }
}
