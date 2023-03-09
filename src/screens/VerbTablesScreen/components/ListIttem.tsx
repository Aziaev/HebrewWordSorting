import { ListRenderItemInfo } from "@shopify/flash-list/src/FlashListProps";
import { IWordRoot } from "../../../types";
import { ELanguage } from "../../../common/constants";
import { ListItemCard } from "./ListItemCard";

interface IListItemProps extends ListRenderItemInfo<IWordRoot> {
  item: IWordRoot;
  extraData: {
    language: ELanguage.ua | ELanguage.ru | ELanguage.en;
    search: string;
  };
}

export function ListItem({
  item,
  extraData: { language, search },
}: IListItemProps) {
  const translation = item[language];

  return (
    <ListItemCard
      translation={translation}
      word={item?.string?.word}
      words={item?.string?.words}
      search={search}
    />
  );
}
