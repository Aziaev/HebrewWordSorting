import { Keyboard, Platform, StyleSheet, View } from "react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { ELanguage } from "../constants";
import {
  useStringsDispatchedActions,
  useStringsStateSelector,
} from "../../store/slices/strings/strings.hooks";
import { LanguageButton } from "./LanguageButton";
import Colors from "../constants/Colors";

export default function BottomBarButtons() {
  const { language } = useStringsStateSelector();
  const { setLanguage } = useStringsDispatchedActions();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      () => setIsKeyboardOpen(true)
    );

    const keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => setIsKeyboardOpen(false)
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  return (
    <View style={styles.bottomBar}>
      <View
        style={isKeyboardOpen ? styles.buttonsWheKeyboardOpen : styles.buttons}
      >
        <LanguageButton
          setLanguage={setLanguage}
          language={language}
          size={isKeyboardOpen ? LanguageButton.size.S : LanguageButton.size.M}
          buttonLanguage={ELanguage.ru}
        />
        <LanguageButton
          setLanguage={setLanguage}
          language={language}
          size={isKeyboardOpen ? LanguageButton.size.S : LanguageButton.size.M}
          buttonLanguage={ELanguage.ua}
        />
        <LanguageButton
          setLanguage={setLanguage}
          language={language}
          size={isKeyboardOpen ? LanguageButton.size.S : LanguageButton.size.M}
          buttonLanguage={ELanguage.en}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    borderTopColor: Colors.grey5,
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? 90 : 60,
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: Colors.background,
  },
  buttons: {
    height: 60,
    padding: 8,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  buttonsWheKeyboardOpen: {
    height: 40,
    padding: 5,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
