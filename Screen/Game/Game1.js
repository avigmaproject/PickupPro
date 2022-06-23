import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  BackHandler,
  SafeAreaView,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import ProgressBar from "react-native-progress/Bar";
const sliderWidth = Dimensions.get("window").width;
const itemHeight = Dimensions.get("window").height;
import AsyncStorage from "@react-native-async-storage/async-storage";

const horizontalMargin = 20;

const itemWidth = sliderWidth + horizontalMargin * 2;

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      carouselItems: [
        { title: "Scoring ", title1: "Title" },
        { title: "Scoring ", title1: "Title" },
        { title: "Scoring ", title1: "Title" },
      ],
    };
  }
  componentDidMount() {}
  NewGame = async () => {
    await AsyncStorage.removeItem("gameid");
    this.props.navigation.navigate("Game");
  };
  render() {
    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <SafeAreaView>
          <View
            style={{
              height: 20,
              width: "100%",
              backgroundColor: "#CA5328",
            }}
          ></View>
          <ScrollView>
            <View
              style={{
                // backgroundColor:'pink',
                justifyContent: "center",
                alignItems: "center",
                marginTop: 60,
              }}
            >
              <Image
                resizeMode="stretch"
                style={{ width: "45%", height: 200, marginBottom: 10 }}
                source={require("../../assets/Logo1.png")}
              />
              <TouchableOpacity
                onPress={() => this.NewGame()}
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
                  style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                >
                  NEW GAME
                </Text>
              </TouchableOpacity>
              {/* <View
                style={{
                  height: 300,
                  width: 280,
                  backgroundColor: "white",
                  elevation: 20,
                  marginVertical: 50,
                }}
              >
                <Carousel
                  data={this.state.carouselItems}
                  onSnapToItem={(index) =>
                    this.setState({ activeIndex: index })
                  }
                  sliderWidth={280}
                  itemWidth={280}
                  itemHeight={itemHeight / 10}
                  renderItem={({ item }) => {
                    return (
                      <View
                        style={{
                          // backgroundColor:'pink',
                          height: 200,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          style={{
                            width: 60,
                            resizeMode: "stretch",
                            height: 60,
                          }}
                          source={require("../../assets/icon/star.png")}
                        />
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={{
                              fontFamily: "KanedaGothic-BoldItalic",
                              fontSize: 20,
                              color: "#2f363c",
                            }}
                          >
                            {item.title}
                          </Text>
                          <Text
                            style={{
                              fontFamily: "KanedaGothic-BoldItalic",
                              fontSize: 20,
                              color: "#CA5328",
                            }}
                          >
                            {item.title1}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                />
                <Pagination
                  dotsLength={this.state.carouselItems.length}
                  activeDotIndex={this.state.activeIndex}
                  dotStyle={{
                    marginHorizontal: -20,
                    backgroundColor: "blue",
                  }}
                />
                <View style={{ alignItems: "center", marginTop: 10 }}>
                  <ProgressBar progress={0.9} width={220} color={"#4850cf"} />
                </View>
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  <Text style={{ color: "#d7d9db", fontSize: 10 }}>
                    Only 8 more points to complete
                  </Text>
                </View>
                <View style={{ alignItems: "center", marginTop: 10 }}>
                  <Text
                    style={{
                      color: "#4850cf",
                      fontSize: 10,
                      textDecorationLine: "underline",
                    }}
                  >
                    Check out your other goals
                  </Text>
                </View>
              </View> */}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
