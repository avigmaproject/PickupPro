import React, { Component } from "react";
import { Text, View } from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
export default class Header extends Component {
  render() {
    return (
      <View
        style={{
          height: 60,
          width: "100%",
          backgroundColor: "#CA5328",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          // flex:1
        }}
      >
        {/* <View style={{
                        backgroundColor:'red',
                        width:'15%'
                      }}>
                         {this.props.icon && (
                    <EvilIcons
                    name="chevron-left"
                    size={40}
                    style={{
                        color: "white",
                        textAlign:'right'
                    }}/>
               )}
                    </View> */}

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
