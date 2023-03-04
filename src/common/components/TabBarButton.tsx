import { Pressable, StyleSheet, Text, View } from "react-native";
import * as React from "react";
import {
  useAppDispatchedActions,
  useAppSelector,
} from "../../store/slices/app/app.hooks";
import { ELanguage, FLAGS_MAP } from "../constants";
import Colors from "../constants/Colors";

export default function TabBarButton() {
  const { appLanguage } = useAppSelector();
  const { setLanguage } = useAppDispatchedActions();

  return (
    <View style={styles.buttons}>
      <Pressable
        onPress={() => setLanguage(ELanguage.ru)}
        disabled={appLanguage === ELanguage.ru}
        style={({ pressed }) => {
          let opacity = 1;
          if (appLanguage !== ELanguage.ru) {
            opacity = 0.7;
          }

          if (pressed) {
            opacity = 0.5;
          }

          return { opacity };
        }}
      >
        <View style={getButtonStyle(appLanguage === ELanguage.ru).button}>
          <Text style={styles.flag}>{FLAGS_MAP[ELanguage.ru]}</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => setLanguage(ELanguage.ua)}
        disabled={appLanguage === ELanguage.ua}
        style={({ pressed }) => {
          let opacity = 1;

          if (appLanguage !== ELanguage.ua) {
            opacity = 0.7;
          }

          if (pressed) {
            opacity = 0.5;
          }

          return { opacity };
        }}
      >
        <View style={getButtonStyle(appLanguage === ELanguage.ua).button}>
          <Text style={styles.flag}>{FLAGS_MAP[ELanguage.ua]}</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => setLanguage(ELanguage.en)}
        disabled={appLanguage === ELanguage.en}
        style={({ pressed }) => {
          let opacity = 1;

          if (appLanguage !== ELanguage.en) {
            opacity = 0.7;
          }

          if (pressed) {
            opacity = 0.5;
          }

          return { opacity };
        }}
      >
        <View style={getButtonStyle(appLanguage === ELanguage.en).button}>
          <Text style={styles.flag}>{FLAGS_MAP[ELanguage.en]}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  flag: {
    fontSize: 24,
  },
});

const getButtonStyle = (selected: boolean) =>
  StyleSheet.create({
    // eslint-disable-next-line react-native/no-unused-styles
    button: {
      width: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      borderColor: Colors.grey3,
      borderWidth: selected ? 2 : 0,
      borderRadius: 10,
    },
  });
