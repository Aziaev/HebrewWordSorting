import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Colors from "../common/constants/Colors";
import StringsScreen from "../screens/StringsScreen/StringsScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../../types";
import LinkingConfiguration from "./LinkingConfiguration";
import SettingsModal from "../screens/SettingsModal";
import { useDatabaseStateSelector } from "../store/slices/dataBase/database.hooks";
import DBLoadingScreen from "../screens/DBLoadingScreen";
import { APP_TITLE } from "../common/constants";
import TabBarButton from "../common/components/TabBarButton";
import { useAppSelector } from "../store/slices/app/app.hooks";

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { ready } = useDatabaseStateSelector();

  return (
    <Stack.Navigator>
      {ready ? (
        <>
          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen
              options={{
                title: "Настройки",
              }}
              name="Settings"
              component={SettingsModal}
            />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen
          name="DBLoadingScreen"
          component={DBLoadingScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const { appLanguage } = useAppSelector();

  return (
    <BottomTab.Navigator
      initialRouteName="Strings"
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        tabBarInactiveTintColor: Colors.grey3,
      }}
    >
      <BottomTab.Screen
        name="Strings"
        component={StringsScreen}
        options={({ navigation }: RootTabScreenProps<"Strings">) => ({
          title: APP_TITLE[appLanguage],
          tabBarLabel: "Поиск",
          tabBarButton: TabBarButton,
          tabBarHideOnKeyboard: false,
          headerStyle: {
            backgroundColor: "#f7f7f7",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            textAlign: "center",
            justifyContent: "center",
            color: Colors.tint,
          },
        })}
      />
    </BottomTab.Navigator>
  );
}
