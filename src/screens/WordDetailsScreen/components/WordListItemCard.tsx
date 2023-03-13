import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../../common/constants/Colors";
import { IString } from "../../../types";
import { map } from "lodash";
import { useStringsStateSelector } from "../../../store/slices/strings/strings.hooks";
import { HightLightedText } from "../../StringsScreen/components/HighLights";
import { useWordDetailsScreenStateSelector } from "../../../store/slices/wordDetails/wordDetails.hooks";

interface IWordListItemCardProps {
  str: IString;
  onPress?: () => void;
  selected: boolean;
}

export function WordListItemCard({
  str,
  onPress,
  selected,
}: IWordListItemCardProps) {
  const { search } = useWordDetailsScreenStateSelector();
  const { language } = useStringsStateSelector();
  const translation = map(
    str.translations,
    (translation) => translation[language]
  ).join(", ");
  const prefix =
    str?.time?.time &&
    str?.time?.pronouns &&
    `${str?.time?.time} ${str?.time?.pronouns}`;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <View
        style={{
          ...styles.card,
          opacity: selected ? 1 : 0.5,
        }}
      >
        <Text
          style={styles.translations}
          adjustsFontSizeToFit
          numberOfLines={3}
        >
          <HightLightedText text={translation} search={search} />
        </Text>
        <View style={styles.hebrewWords}>
          {prefix ? (
            <View style={styles.row}>
              <Text
                style={[
                  styles.hebrewText,
                  styles.word,
                  { color: selected ? "red" : "black" },
                ]}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {str.words}
              </Text>
              <Text
                style={[
                  styles.hebrewText,
                  styles.auxWords,
                  { color: selected ? "brown" : "black" },
                ]}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {prefix}
              </Text>
            </View>
          ) : (
            <Text
              style={[
                styles.hebrewText,
                { textAlign: "center", color: selected ? "red" : "black" },
              ]}
            >
              {str.words}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 3,
    borderColor: Colors.grey2,
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
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
    fontSize: 24,
  },
});
