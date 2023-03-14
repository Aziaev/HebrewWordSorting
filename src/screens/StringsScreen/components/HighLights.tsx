import { Fragment } from "react";
import { Text } from "react-native";
import { trimHebrewText } from "../../../common/helpers";

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

interface IHightLightHebrewTextProps {
  search: string;
  displayText: string;
  compareText?: string;
}

export function HightLightHebrewText({
  search,
  displayText = "",
  compareText,
}: IHightLightHebrewTextProps) {
  const compareTextArray = compareText?.split(",");
  const displayTextArray = displayText?.split(",");

  const TextElements = displayTextArray.map((displayText, index, arr) => {
    let style;

    const searchTrim = trimHebrewText(search.toLowerCase());
    const trimCompare = trimHebrewText(compareTextArray?.[index]);

    console.log({ search, searchTrim, trimCompare });

    if (searchTrim && trimCompare === searchTrim) {
      style = {
        color: "#F00",
      };
    }

    return (
      <Fragment key={index}>
        <Text style={style}>{displayText}</Text>
        {index < arr.length - 1 && <Text>, </Text>}
      </Fragment>
    );
  });

  return <>{TextElements}</>;
}
