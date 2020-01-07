import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Animation } from "./src/Decay";

export default function App() {
  return (
    <View style={styles.container}>
      <Animation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
