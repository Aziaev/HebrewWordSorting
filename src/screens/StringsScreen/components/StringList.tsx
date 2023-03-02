import { StyleSheet, View } from "react-native";
import { Text } from "../../../common/components/Themed";
import {
  useStringsDispatchedActions,
  useStringsStateSelector,
} from "../../../store/slices/strings/strings.hooks";
import { FlashList } from "@shopify/flash-list";
import { isEmpty, map, noop } from "lodash";
import { IString } from "../../../types";
import { ListRenderItemInfo } from "@shopify/flash-list/src/FlashListProps";
import Colors from "../../../constants/Colors";
import { ELanguage } from "../../../store/slices/strings/strings";

export default function StringList() {
  const { list, lang } = useStringsStateSelector();
  const { fetchNextPage } = useStringsDispatchedActions();

  return (
    <FlashList<IString>
      extraData={{ lang }}
      data={list}
      estimatedItemSize={100}
      renderItem={ListItem}
      onEndReachedThreshold={0.6}
      onEndReached={isEmpty(list) ? noop : fetchNextPage}
    />
  );
}

function ListItem({ item, extraData: { lang } }: ListRenderItemInfo<IString>) {
  const hasTime = item.time?.time && item.time?.pronouns;

  return (
    <View key={item.id} style={styles.card}>
      <Text style={styles.translations}>
        {map(item.translations, (translation) => (
          <Text key={translation.id}>{translation[ELanguage.ru]}</Text>
        ))}
      </Text>
      <View style={styles.hebrewWords}>
        {hasTime ? (
          <View style={styles.row}>
            <Text style={[styles.hebrewText, styles.word]}>{item.words}</Text>
            <Text style={[styles.hebrewText, styles.auxWords]}>
              {item?.time?.time} ${item?.time?.pronouns}
            </Text>
          </View>
        ) : (
          <Text style={[styles.hebrewText, { textAlign: "center" }]}>
            {item.words}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderColor: Colors.grey2,
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  translations: {
    backgroundColor: Colors.grey2,
    width: "100%",
    paddingBottom: 5,
    paddingTop: 5,
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  hebrewWords: {
    width: "100%",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
  },
  row: {
    display: "flex",
    flexDirection: "row",
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
  },
});
