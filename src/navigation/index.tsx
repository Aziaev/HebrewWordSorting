import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Colors from "../constants/Colors";
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
import { Pressable } from "react-native";

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

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
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
          title: "Сортировщик слов",
          tabBarLabel: "Поиск",
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          headerStyle: {
            backgroundColor: "#f7f7f7",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            textAlign: "center",
            justifyContent: "center",
            color: Colors.tint,
          },
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Settings")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="gear"
                size={25}
                color={Colors.accentColor}
                style={{ marginRight: 20 }}
              />
            </Pressable>
          ),
        })}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}
