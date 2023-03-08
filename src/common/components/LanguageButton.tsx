import { ELanguage, FLAGS_MAP } from "../constants";
import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import * as React from "react";
import Colors from "../constants/Colors";

enum Size {
  small,
  big,
}

export function LanguageButton({
  setLanguage,
  language,
  buttonLanguage,
  size = Size.small,
}: {
  setLanguage: (lang: ELanguage.ru | ELanguage.ua | ELanguage.en) => void;
  language: ELanguage.ru | ELanguage.ua | ELanguage.en;
  buttonLanguage: ELanguage.ru | ELanguage.ua | ELanguage.en;
  size?: Size;
}) {
  return (
    <Pressable
      onPress={() => setLanguage(buttonLanguage)}
      disabled={language === buttonLanguage}
      style={({ pressed }) => {
        let opacity = 1;

        if (language !== buttonLanguage) {
          opacity = 0.7;
        }

        if (pressed) {
          opacity = 0.5;
        }

        return { opacity };
      }}
    >
      <View style={getStyle(language === buttonLanguage, size).button}>
        <Text style={getStyle(language === buttonLanguage, size).flag}>
          {FLAGS_MAP[buttonLanguage]}
        </Text>
      </View>
    </Pressable>
  );
}

const getStyle = (selected: boolean, size: Size) =>
  StyleSheet.create({
    // eslint-disable-next-line react-native/no-unused-styles
    button: {
      width: size === Size.small ? 50 : 80,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      borderColor: Colors.grey3,
      borderWidth: selected ? 2 : 0,
      borderRadius: size === Size.small ? 10 : 15,
    },
    flag: {
      fontSize: size === Size.small ? 24 : 40,
    },
  });

LanguageButton.size = Size;
