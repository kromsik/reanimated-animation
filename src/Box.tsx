import React from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

const BOX_WIDTH = 200;
const BOX_HEIGHT = 200;

const Box = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    borderRadius: 8,
    backgroundColor: "orange"
  }
});

export { Box, BOX_WIDTH, BOX_HEIGHT };
