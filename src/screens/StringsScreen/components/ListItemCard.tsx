import { StyleSheet, View, Text } from "react-native";
import { ReactNode } from "react";
import Colors from "../../../common/constants/Colors";
import { HightLightedText } from "./StringList";

interface IListItemCardProps {
  translation: string;
  word: string;
  prefix?: string;
  search: string;
}

export function ListItemCard({
  translation,
  word,
  prefix,
  search,
}: IListItemCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.translations} adjustsFontSizeToFit numberOfLines={2}>
        <HightLightedText text={translation} search={search} />
      </Text>
      <View style={styles.hebrewWords}>
        {prefix ? (
          <View style={styles.row}>
            <Text
              style={[styles.hebrewText, styles.word]}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              <HightLightedText text={word} search={search} />
            </Text>
            <Text
              style={[styles.hebrewText, styles.auxWords]}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {prefix}
            </Text>
          </View>
        ) : (
          <Text style={[styles.hebrewText, { textAlign: "center" }]}>
            <HightLightedText text={word} search={search} />
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 3,
    borderColor: Colors.grey2,
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  translations: {
    minHeight: 32,
    backgroundColor: Colors.grey2,
    width: "100%",
    paddingBottom: 5,
    paddingTop: 3,
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  hebrewWords: {
    height: 40,
    width: "100%",
    paddingTop: 4,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  hebrewText: {
    fontSize: 28,
    fontFamily: "David",
  },
  word: {
    textAlign: "right",
    flex: 1,
    color: "black",
  },
  auxWords: {
    textAlign: "left",
    flex: 1,
    color: "brown",
    fontSize: 24,
  },
});
