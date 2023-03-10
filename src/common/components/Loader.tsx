import { ActivityIndicator, StyleSheet } from "react-native";
import { EZIndex } from "../constants";

export default function Loader() {
  return <ActivityIndicator size="large" color="black" style={styles.loader} />;
}

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    backgroundColor: "rgb(255,255,255)",
    height: "100%",
    width: "100%",
    zIndex: EZIndex.loader,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
