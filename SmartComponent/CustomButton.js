import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";

export default class CustomButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
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
      </TouchableOpacity>
    );
  }
}
