import { StyleSheet, View } from "react-native";
import * as React from "react";
import { ELanguage } from "../constants";
import {
  useStringsDispatchedActions,
  useStringsStateSelector,
} from "../../store/slices/strings/strings.hooks";
import { LanguageButton } from "./LanguageButton";

export default function TabBarButton() {
  const { language } = useStringsStateSelector();
  const { setLanguage } = useStringsDispatchedActions();

  return (
    <View style={styles.buttons}>
      <LanguageButton
        setLanguage={setLanguage}
        language={language}
        buttonLanguage={ELanguage.ru}
      />
      <LanguageButton
        setLanguage={setLanguage}
        language={language}
        buttonLanguage={ELanguage.ua}
      />
      <LanguageButton
        setLanguage={setLanguage}
        language={language}
        buttonLanguage={ELanguage.en}
      />
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
});
