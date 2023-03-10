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
import { useNavigation } from "@react-navigation/native";

export default function StringList() {
  const { list, search } = useStringsStateSelector();
  const { fetchNextPage } = useStringsDispatchedActions();
  const { language } = useStringsStateSelector();
  const isHebrewSearch = getIsHebrewText(search);
  const { navigate } = useNavigation();

  return (
    <FlashList<IString | IWordRoot>
      extraData={{ language, search, navigate }}
      data={list}
      estimatedItemSize={100}
      // @ts-expect-error
      renderItem={isHebrewSearch ? HebrewListItem : ListItem}
      onEndReachedThreshold={0.6}
      onEndReached={isEmpty(list) ? noop : fetchNextPage}
    />
  );
}
