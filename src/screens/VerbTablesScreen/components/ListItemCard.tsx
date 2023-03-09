import { StyleSheet, Text, View } from "react-native";
import Colors from "../../../common/constants/Colors";
import { HightLightedText, HightLightHebrewText } from "./HighLights";

interface IListItemCardProps {
  translation: string;
  word: string;
  words?: string;
  prefix?: string;
  search: string;
}

export function ListItemCard({
  translation,
  word,
  words = "",
  prefix,
  search,
}: IListItemCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.translations} adjustsFontSizeToFit numberOfLines={3}>
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
              <HightLightHebrewText
                search={search}
                compareText={word}
                displayText={words}
              />
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
            <HightLightHebrewText
              search={search}
              compareText={word}
              displayText={words}
            />
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
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  hebrewWords: {
    height: 46,
    width: "100%",
    paddingTop: 3,
    paddingBottom: 3,
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
    fontSize: 32,
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
