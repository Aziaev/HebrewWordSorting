import {
  useStringsDispatchedActions,
  useStringsStateSelector,
} from "../../../store/slices/strings/strings.hooks";
import { FlashList } from "@shopify/flash-list";
import { isEmpty, noop } from "lodash";
import { IString, IWordRoot } from "../../../types";
import { getIsHebrewText } from "../../../common/helpers";
import { HebrewListItem } from "./HebrewListItem";
import { ListItem } from "./ListIttem";
import { Text } from "react-native";
import { Fragment } from "react";

export default function StringList() {
  const { list, search } = useStringsStateSelector();
  const { fetchNextPage } = useStringsDispatchedActions();
  const { language } = useStringsStateSelector();
  const isHebrewSearch = getIsHebrewText(search);

  return (
    <FlashList<IString | IWordRoot>
      extraData={{ language, search }}
      data={list}
      estimatedItemSize={100}
      // @ts-expect-error
      renderItem={isHebrewSearch ? HebrewListItem : ListItem}
      onEndReachedThreshold={0.6}
      onEndReached={isEmpty(list) ? noop : fetchNextPage}
    />
  );
}

interface IProps {
  search: string;
  text: string;
}

export function HightLightedText({ search, text }: IProps) {
  const searchString = search.toLowerCase().trim();

  const TextElements = text?.split(",").map((str, index, arr) => {
    let style;
    const text = str.trim().toLowerCase();

    if (search && text === searchString) {
      style = {
        color: "#F00",
      };
    }

    return (
      <Fragment key={index}>
        <Text style={style}>{str}</Text>
        {index < arr.length - 1 && <Text>, </Text>}
      </Fragment>
    );
  });

  return <>{TextElements}</>;
}
