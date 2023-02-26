import {StatusBar} from "expo-status-bar";
import {SafeAreaProvider} from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import {FC} from "react";
import {LogBox} from "react-native";
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import {useDbInit} from "./db/hooks";

LogBox.ignoreAllLogs();

const App: FC = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <Navigation colorScheme={colorScheme}/>
      <StatusBar/>
    </SafeAreaProvider>
  );
};

const RootComponent = registerRootComponent(App);

export default RootComponent
