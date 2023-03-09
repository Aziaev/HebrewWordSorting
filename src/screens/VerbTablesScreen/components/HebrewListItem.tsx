import { ListRenderItemInfo } from "@shopify/flash-list/src/FlashListProps";
import { IString } from "../../../types";
import { ELanguage } from "../../../common/constants";
import { map } from "lodash";
import { ListItemCard } from "./ListItemCard";

interface IHebrewListItemProps extends ListRenderItemInfo<IString> {
  item: IString;
  extraData: {
    language: ELanguage.ua | ELanguage.ru | ELanguage.en;
    search: string;
  };
}

export function HebrewListItem({
  item,
  extraData: { language, search },
}: IHebrewListItemProps) {
  const translation = map(
    item.translations,
    (translation, index, collection) => translation[language]
  ).join(", ");

  const prefix =
    item?.time?.time &&
    item?.time?.pronouns &&
    `${item?.time?.time} ${item?.time?.pronouns}`;

  return (
    <ListItemCard
      translation={translation}
      word={item?.word}
      words={item?.words}
      prefix={prefix}
      search={search}
    />
  );
}
