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
  return (
    <View key={item.id} style={styles.card}>
      <Text style={styles.translations}>
        {map(item.translations, (translation) => (
          <Text key={translation.id}>{translation[ELanguage.ru]}</Text>
        ))}
      </Text>

      <Text style={styles.hebrew}>
        {item.time && `${item.time.time} ${item.time.pronouns} `}
        {item.words}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderColor: Colors.appBackground,
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  translations: {
    backgroundColor: Colors.appBackground,
    width: "100%",
    paddingBottom: 5,
    paddingTop: 5,
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  hebrew: {
    textAlign: "center",
    width: "100%",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 28,
    fontFamily: "David",
    color: "black",
  },
});
