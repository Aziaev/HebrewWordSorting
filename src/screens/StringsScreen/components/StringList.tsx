import { StyleSheet, View } from "react-native";
import { Text } from "../../../common/components/Themed";
import {
  useStringsDispatchedActions,
  useStringsStateSelector,
} from "../../../store/slices/strings/strings.hooks";
import { FlashList } from "@shopify/flash-list";
import { isEmpty, map, noop } from "lodash";
import { IString, IWordRoot } from "../../../types";
import { ListRenderItemInfo } from "@shopify/flash-list/src/FlashListProps";
import Colors from "../../../common/constants/Colors";
import { useAppSelector } from "../../../store/slices/app/app.hooks";
import { ELanguage } from "../../../common/constants";
import { Fragment } from "react";
import { getIsHebrewText } from "../../../common/helpers";

export default function StringList() {
  const { list, search } = useStringsStateSelector();
  const { fetchNextPage } = useStringsDispatchedActions();
  const { appLanguage } = useAppSelector();
  const isHebrewSearch = getIsHebrewText(search);

  return (
    <FlashList<IString | IWordRoot>
      extraData={{ appLanguage, search }}
      data={list}
      estimatedItemSize={100}
      // @ts-expect-error
      renderItem={isHebrewSearch ? HebrewListItem : ListItem}
      onEndReachedThreshold={0.6}
      onEndReached={isEmpty(list) ? noop : fetchNextPage}
    />
  );
}

interface IHebrewListItemProps extends ListRenderItemInfo<IString> {
  item: IString;
  extraData: {
    appLanguage: ELanguage.ua | ELanguage.ru | ELanguage.en;
    search: string;
  };
}

function HebrewListItem({
  item,
  extraData: { appLanguage },
}: IHebrewListItemProps) {
  const hasTime = item?.time?.time && item?.time?.pronouns;

  return (
    <View key={item.id} style={styles.card}>
      <Text style={styles.translations}>
        {map(item.translations, (translation, index, collection) => (
          <Fragment key={translation.id}>
            <Text>{translation[appLanguage]}</Text>
            {index > 0 && index <= collection.length - 1 && (
              <Text key={translation.id}>, </Text>
            )}
          </Fragment>
        ))}
      </Text>
      <View style={styles.hebrewWords}>
        {hasTime ? (
          <View style={styles.row}>
            <Text
              style={[styles.hebrewText, styles.word]}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {item.words}
            </Text>
            <Text
              style={[styles.hebrewText, styles.auxWords]}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {item?.time?.time} {item?.time?.pronouns}
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

interface IListItemProps extends ListRenderItemInfo<IWordRoot> {
  item: IWordRoot;
  extraData: {
    appLanguage: ELanguage.ua | ELanguage.ru | ELanguage.en;
    search: string;
  };
}

function ListItem({ item, extraData: { appLanguage } }: IListItemProps) {
  const hasTime = item.string?.time?.time && item.string?.time?.pronouns;

  return (
    <View key={item.id} style={styles.card}>
      <Text style={styles.translations} adjustsFontSizeToFit numberOfLines={1}>
        <Text>{item[appLanguage]}</Text>
      </Text>
      <View style={styles.hebrewWords}>
        {hasTime ? (
          <View style={styles.row}>
            <Text
              style={[styles.hebrewText, styles.word]}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {item.string.words}
            </Text>
            <Text
              style={[styles.hebrewText, styles.auxWords]}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {item.string?.time?.time} {item.string?.time?.pronouns}
            </Text>
          </View>
        ) : (
          <Text style={[styles.hebrewText, { textAlign: "center" }]}>
            {item.string?.words}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 2,
    borderColor: Colors.grey2,
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  translations: {
    height: 32,
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
