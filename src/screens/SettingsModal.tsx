import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Text, View } from "../common/components/Themed";
import {
  ELanguage,
  SELECT_APP_LANGUAGE,
  SELECTED_APP_LANGUAGE,
} from "../common/constants";
import * as React from "react";
import {
  useAppDispatchedActions,
  useAppSelector,
} from "../store/slices/app/app.hooks";
import Colors from "../common/constants/Colors";
import { LanguageButton } from "../common/components/LanguageButton";

export default function SettingsModal() {
  const { appLanguage } = useAppSelector();
  const { setAppLanguage } = useAppDispatchedActions();

  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <View style={styles.body}>
        <Text style={styles.title}>{SELECT_APP_LANGUAGE[appLanguage]}</Text>
        <View style={styles.buttonsWheKeyboardOpen}>
          <LanguageButton
            setLanguage={setAppLanguage}
            language={appLanguage}
            buttonLanguage={ELanguage.ru}
            size={LanguageButton.size.L}
          />
          <LanguageButton
            setLanguage={setAppLanguage}
            language={appLanguage}
            buttonLanguage={ELanguage.ua}
            size={LanguageButton.size.L}
          />
          <LanguageButton
            setLanguage={setAppLanguage}
            language={appLanguage}
            buttonLanguage={ELanguage.en}
            size={LanguageButton.size.L}
          />
        </View>
        <Text style={styles.muted}>{SELECTED_APP_LANGUAGE[appLanguage]}</Text>
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
  buttonsWheKeyboardOpen: {
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
  muted: {
    marginTop: 20,
    fontSize: 14,
    color: Colors.grey5,
  },
});
