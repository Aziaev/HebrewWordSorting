import { ListRenderItemInfo } from "@shopify/flash-list/src/FlashListProps";
import { IWordRoot } from "../../../types";
import { ELanguage } from "../../../common/constants";
import { ListItemCard } from "./ListItemCard";
import VerbTablesScreen from "../../VerbTablesScreen/VerbTablesScreen";
import NonVerbScreen from "../../NonVerbScreen/NonVerbScreen";

interface IListItemProps extends ListRenderItemInfo<IWordRoot> {
  item: IWordRoot;
  extraData: {
    language: ELanguage.ua | ELanguage.ru | ELanguage.en;
    search: string;
    navigate: (path: string) => void;
  };
}

export function ListItem({
  item,
  extraData: { language, search, navigate },
}: IListItemProps) {
  const translation = item[language];

  function handlePressItem() {
    console.log("handleClickItem", item);
    const isVerb = item?.strings[0]?.r;
    navigate(isVerb ? VerbTablesScreen.path : NonVerbScreen.path);
  }

  return (
    <ListItemCard
      onPress={handlePressItem}
      translation={translation}
      word={item?.string?.word}
      words={item?.string?.words}
      search={search}
    />
  );
}
