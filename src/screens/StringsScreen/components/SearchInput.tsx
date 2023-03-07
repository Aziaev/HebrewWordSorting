import { TextInput } from "react-native";
import {
  useStringsDispatchedActions,
  useStringsStateSelector,
} from "../../../store/slices/strings/strings.hooks";
import { INPUT_PLACEHOLDER } from "../../../common/constants";
import * as React from "react";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "../../../store/slices/app/app.hooks";
import Colors from "../../../common/constants/Colors";
import { getIsHebrewText } from "../../../common/helpers";
import { debounce } from "lodash";

export default function SearchInput() {
  const { appLanguage } = useAppSelector();
  const { search } = useStringsStateSelector();
  const { setSearch, searchByString } = useStringsDispatchedActions();

  const debouncedSearchByString = useMemo(
    () => debounce(searchByString, 400),
    [searchByString]
  );

  useEffect(() => {
    debouncedSearchByString();
  }, [search, searchByString, appLanguage, debouncedSearchByString]);

  return (
    <TextInput
      // @ts-expect-error
      style={getTextInputStyles(search)}
      value={search}
      onChangeText={setSearch}
      placeholder={INPUT_PLACEHOLDER[appLanguage]}
      placeholderTextColor={Colors.grey6}
    />
  );
}

function getTextInputStyles(search: string) {
  return {
    paddingTop: 15,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 24,
    fontFamily: getIsHebrewText(search) ? "David" : undefined,
    fontWeight: "700",
    borderBottomColor: Colors.grey6,
    borderBottomWidth: 1,
    textAlign: getDirection(search),
    width: "100%",
    height: 55,
  };
}

function getDirection(text: string): "left" | "right" {
  return getIsHebrewText(text) ? "right" : "left";
}
