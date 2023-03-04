import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet } from "react-native";
import { Text, View } from "../common/components/Themed";
import { ELanguage, FLAGS_MAP } from "../common/constants";
import * as React from "react";
import {
  useAppDispatchedActions,
  useAppSelector,
} from "../store/slices/app/app.hooks";
import Colors from "../common/constants/Colors";

export default function SettingsModal() {
  const { appLanguage } = useAppSelector();
  const { setLanguage } = useAppDispatchedActions();

  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <View style={styles.body}>
        <Text style={styles.title}>
          {appLanguage === ELanguage.ru
            ? "Выберите язык приложения"
            : "Виберіть мову програми"}
        </Text>
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
        </View>
        <Text style={styles.muted}>
          {appLanguage === ELanguage.ru
            ? "Выбран язык: Русский"
            : "Вибрана мова: Український"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  body: {
    width: "100%",
    marginTop: 18,
    marginRight: 20,
    marginLeft: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  buttons: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  flag: {
    fontSize: 40,
  },
  muted: {
    marginTop: 20,
    fontSize: 14,
    color: Colors.grey5,
  },
});

const getButtonStyle = (selected: boolean) =>
  StyleSheet.create({
    // eslint-disable-next-line react-native/no-unused-styles
    button: {
      width: 80,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      borderColor: Colors.grey3,
      borderWidth: selected ? 2 : 0,
      borderRadius: 15,
    },
  });
