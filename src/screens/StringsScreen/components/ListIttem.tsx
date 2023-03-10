import { ListRenderItemInfo } from "@shopify/flash-list/src/FlashListProps";
import { IWordRoot } from "../../../types";
import { ELanguage } from "../../../common/constants";
import { ListItemCard } from "./ListItemCard";
import WordDetails from "../../WordDetailsScreen/WordDetails";
import { IStringsState } from "../../../store/slices/wordDetails/wordDetails";

interface IListItemProps extends ListRenderItemInfo<IWordRoot> {
  item: IWordRoot;
  extraData: {
    language: ELanguage.ua | ELanguage.ru | ELanguage.en;
    search: string;
    navigate: (path: string) => void;
    setSearchProps: (
      payload: Pick<IStringsState, "clickedItem" | "search" | "language">
    ) => void;
  };
}

export function ListItem({
  item,
  extraData: { language, search, navigate, setSearchProps },
}: IListItemProps) {
  const translation = item[language];

  function handlePressItem() {
    setSearchProps({ clickedItem: item, search, language });

    navigate(WordDetails.path);
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
