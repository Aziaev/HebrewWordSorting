import { ListRenderItemInfo } from "@shopify/flash-list/src/FlashListProps";
import { IString } from "../../../types";
import { ELanguage } from "../../../common/constants";
import { map } from "lodash";
import { ListItemCard } from "./ListItemCard";
import VerbTablesScreen from "../../VerbTablesScreen/VerbTablesScreen";
import NonVerbScreen from "../../NonVerbScreen/NonVerbScreen";

interface IHebrewListItemProps extends ListRenderItemInfo<IString> {
  item: IString;
  extraData: {
    language: ELanguage.ua | ELanguage.ru | ELanguage.en;
    search: string;
    navigate: (path: string) => void;
  };
}

export function HebrewListItem({
  item,
  extraData: { language, search, navigate },
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
    console.log("handleClickItem", item);
    const isVerb = item?.r;
    navigate(isVerb ? VerbTablesScreen.path : NonVerbScreen.path);
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
