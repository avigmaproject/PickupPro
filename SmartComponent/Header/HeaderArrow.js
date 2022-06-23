import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";

export default class HeaderArrow extends Component {
  render() {
    return (
      <View
        style={{
          height: 70,
          width: "100%",
          backgroundColor: "#CA5328",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          // flex:1
        }}
      >
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack()}
          style={{
            position: "absolute",
            left: 0,
          }}
        >
          <EvilIcons
            name="chevron-left"
            size={40}
            style={{
              color: "white",
              textAlign: "left",
            }}
          />
        </TouchableOpacity>

        <View>
          <Text
            style={{
              color: "white",
              fontSize: 35,
              fontFamily: "KanedaGothic-BoldItalic",
              justifyContent: "center",
            }}
          >
            {" "}
            {this.props.title}{" "}
          </Text>
        </View>
      </View>
    );
  }
}
