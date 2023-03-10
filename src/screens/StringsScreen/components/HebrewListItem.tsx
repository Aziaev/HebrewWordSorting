import { ListRenderItemInfo } from "@shopify/flash-list/src/FlashListProps";
import { IString } from "../../../types";
import { ELanguage } from "../../../common/constants";
import { map } from "lodash";
import { ListItemCard } from "./ListItemCard";
import WordDetails from "../../WordDetailsScreen/WordDetails";
import { IStringsState } from "../../../store/slices/wordDetails/wordDetails";

interface IHebrewListItemProps extends ListRenderItemInfo<IString> {
  item: IString;
  extraData: {
    language: ELanguage.ua | ELanguage.ru | ELanguage.en;
    search: string;
    navigate: (path: string) => void;
    setSearchProps: (
      payload: Pick<IStringsState, "clickedItem" | "search" | "language">
    ) => void;
  };
}

export function HebrewListItem({
  item,
  extraData: { language, search, navigate, setSearchProps },
}: IHebrewListItemProps) {
  const translation = map(
    item.translations,
    (translation) => translation[language]
  ).join(", ");
  const prefix =
    item?.time?.time &&
    item?.time?.pronouns &&
    `${item?.time?.time} ${item?.time?.pronouns}`;

  function handlePressItem() {
    setSearchProps({ clickedItem: item, search, language });

    navigate(WordDetails.path);
  }

  return (
    <ListItemCard
      onPress={handlePressItem}
      translation={translation}
      word={item?.word}
      words={item?.words}
      prefix={prefix}
      search={search}
    />
  );
}
