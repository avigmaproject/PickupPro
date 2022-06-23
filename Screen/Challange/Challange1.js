import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Header from "../../SmartComponent/Header/Header";
import Carousel, { Pagination } from "react-native-snap-carousel";
import AntDesign from "react-native-vector-icons/AntDesign";
import ProgressBar from "react-native-progress/Bar";
export default class Challange1 extends Component {
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

  render() {
    return (
      <View>
        <Header title="Your challenges live here" />
        <ScrollView>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View
              style={{
                height: 380,
                width: "80%",
                backgroundColor: "white",
                elevation: 20,
                marginTop: 50,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.carousel._snapToItem(this.state.activeIndex - 1);
                }}
              >
                <AntDesign
                  name="left"
                  size={40}
                  style={{
                    position: "absolute",
                    top: 180,
                    left: 5,
                    fontWeight: "bold",
                  }}
                  color="#CA5328"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.carousel._snapToItem(this.state.activeIndex + 1);
                }}
              >
                <AntDesign
                  name="right"
                  size={40}
                  style={{
                    fontWeight: "bold",
                    position: "absolute",
                    right: 5,
                    top: 180,
                  }}
                  color="#CA5328"
                />
              </TouchableOpacity>
              <Carousel
                ref={(ref) => (this.carousel = ref)}
                onSnapToItem={(index) => this.setState({ activeIndex: index })}
                data={this.state.carouselItems}
                sliderWidth={250}
                itemWidth={250}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        position: "absolute",
                        top: 60,
                        right: 10,
                        // flex: 1,
                        // backgroundColor:'pink',
                        // justifyContent: 'center',
                        // alignItems: 'center',
                        // height: 400
                      }}
                    >
                      <Image
                        style={{
                          width: 100,
                          // backgroundColor:'red',
                          position: "absolute",
                          resizeMode: "stretch",
                          left: 40,
                          height: 100,
                        }}
                        source={require("../../assets/icons_folder/blue/logo-6.png")}
                      />
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{
                            color: "black",
                            marginTop: 100,
                            fontSize: 50,
                            fontFamily: "KanedaGothic-BoldItalic",
                          }}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={{
                            color: "#CA5328",
                            marginTop: 100,
                            fontSize: 50,
                            fontFamily: "KanedaGothic-BoldItalic",
                          }}
                        >
                          {item.title1}
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />
              <View style={{ position: "absolute", top: 270, left: 20 }}>
                <ProgressBar progress={0.9} width={250} color={"#4850cf"} />
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "gray", fontSize: 15 }}>
                  Only 8 more points to complete
                </Text>
              </View>
              <Pagination
                dotsLength={this.state.carouselItems.length}
                activeDotIndex={this.state.activeIndex}
                // containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
                dotStyle={{
                  // width: 10,
                  // height: 10,
                  // borderRadius: 5,
                  marginHorizontal: -20,
                  backgroundColor: "blue",
                }}
                inactiveDotStyle={
                  {
                    // Define styles for inactive dots here
                  }
                }
                // inactiveDotOpacity={0.4}
                // inactiveDotScale={0.6}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                // backgroundColor:"red",
                width: "99%",
                justifyContent: "space-around",
                height: 200,
              }}
            >
              <View>
                <AntDesign
                  name="left"
                  size={40}
                  style={{ fontWeight: "bold", marginTop: 20 }}
                  color="#CA5328"
                />
              </View>
              <View>
                <View
                  style={{
                    // backgroundColor:'red',
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{
                      width: 50,
                      // backgroundColor:'red',
                      // position:'absolute',
                      resizeMode: "stretch",
                      // left:30,
                      height: 50,
                    }}
                    source={require("../../assets/icons_folder/blue/logo-6.png")}
                  />
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 20,
                      fontFamily: "KanedaGothic-BoldItalic",
                    }}
                  >
                    Scoring{" "}
                  </Text>
                  <Text
                    style={{
                      color: "#CA5328",
                      fontSize: 20,
                      fontFamily: "KanedaGothic-BoldItalic",
                    }}
                  >
                    Title
                  </Text>
                </View>
              </View>
              <View>
                <View
                  style={{
                    // backgroundColor:'red',
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{
                      width: 50,
                      // backgroundColor:'red',
                      // position:'absolute',
                      resizeMode: "stretch",
                      // left:30,
                      height: 50,
                    }}
                    source={require("../../assets/icons_folder/blue/logo-6.png")}
                  />
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 20,
                      fontFamily: "KanedaGothic-BoldItalic",
                    }}
                  >
                    Scoring{" "}
                  </Text>
                  <Text
                    style={{
                      color: "#CA5328",
                      fontSize: 20,
                      fontFamily: "KanedaGothic-BoldItalic",
                    }}
                  >
                    Title
                  </Text>
                </View>
              </View>
              <View>
                <View
                  style={{
                    // backgroundColor:'red',
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{
                      width: 50,
                      // backgroundColor:'red',
                      // position:'absolute',
                      resizeMode: "stretch",
                      // left:30,
                      height: 50,
                    }}
                    source={require("../../assets/icons_folder/blue/logo-6.png")}
                  />
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 20,
                      fontFamily: "KanedaGothic-BoldItalic",
                    }}
                  >
                    Scoring{" "}
                  </Text>
                  <Text
                    style={{
                      color: "#CA5328",
                      fontSize: 20,
                      fontFamily: "KanedaGothic-BoldItalic",
                    }}
                  >
                    Title
                  </Text>
                </View>
              </View>
              <View>
                <AntDesign
                  name="right"
                  size={40}
                  style={{ fontWeight: "bold", marginTop: 20 }}
                  color="#CA5328"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    borderWidth: 2,
    borderColor: "#CCC",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
