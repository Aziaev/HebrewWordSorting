import { ELanguage, FLAGS_MAP } from "../constants";
import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import * as React from "react";
import Colors from "../constants/Colors";

enum Size {
  S,
  M,
  L,
}

export function LanguageButton({
  setLanguage,
  language,
  buttonLanguage,
  size = Size.S,
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

const sizeMap = {
  [Size.S]: { borderRadius: 8, fontSize: 18, width: 40 },
  [Size.M]: { borderRadius: 10, fontSize: 24, width: 50 },
  [Size.L]: { borderRadius: 15, fontSize: 40, width: 80 },
};

const getStyle = (selected: boolean, size: Size) =>
  StyleSheet.create({
    // eslint-disable-next-line react-native/no-unused-styles
    button: {
      width: sizeMap[size].width,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      borderColor: Colors.grey3,
      borderWidth: selected ? 2 : 0,
      borderRadius: sizeMap[size].borderRadius,
    },
    // eslint-disable-next-line react-native/no-unused-styles
    flag: {
      fontSize: sizeMap[size].fontSize,
    },
  });

LanguageButton.size = Size;
