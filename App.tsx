import Provided from "./src";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

export default function App() {
  return <Provided />;
}
